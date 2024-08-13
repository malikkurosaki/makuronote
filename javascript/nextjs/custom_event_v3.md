eventClient.tsx

```tsx
'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, onChildChanged, ref, set } from "firebase/database";
import { decode } from "js-base64";
import { useEffect, useMemo } from "react";

type Event = {
  id: string;
  val: any;
};

const remoteState = hookstate<Event | null>(null);
const localState = hookstate<Event | null>(null);

const useRemote = () => {
  const state = useHookstate(remoteState);
  return [state.value, state.set] as const;
}

const useLocal = () => {
  const state = useHookstate(localState);
  return [state.value, state.set] as const;
}

const useFirebaseApp = (config: string) => {
  return useMemo(() => {
    const appConfig = JSON.parse(decode(config));
    if (getApps().length === 0) {
      return initializeApp(appConfig);
    }
    return getApp();
  }, [config]);
};

const useDatabase = (config: string) => {
  const app = useFirebaseApp(config);
  return useMemo(() => getDatabase(app), [app]);
};

function useSubscribeToEvents(database: ReturnType<typeof getDatabase>, projectId: string, listSubscribe: string[]) {
  const [, setRemoteVal] = useRemote();

  useEffect(() => {
    listSubscribe.forEach((subscribe) => {
      const dbRef = ref(database, `wibu/${projectId}/${subscribe}`);
      onChildChanged(dbRef, (snapshot) => {
        setRemoteVal({ id: subscribe, val: snapshot.val() });
      });
    });
  }, [database, projectId, listSubscribe, setRemoteVal]);
}

function useSyncLocalEvent(database: ReturnType<typeof getDatabase>, projectId: string) {
  const [localVal] = useLocal();

  useEffect(() => {
    if (localVal) {
      const dbRef = ref(database, `wibu/${projectId}/${localVal.id}`);
      set(dbRef, { data: localVal.val });
    }
  }, [database, projectId, localVal]);
}

function EventProvider({ children, config, projectId, listSubscribe }: { children: React.ReactNode, config: string, projectId: string, listSubscribe: string[] }) {
  const database = useDatabase(config);

  useSubscribeToEvents(database, projectId, listSubscribe);
  useSyncLocalEvent(database, projectId);

  return <>{children}</>;
}

function useEventClient() {
  const [remoteVal] = useRemote();
  const [, setLocalVal] = useLocal();
  return [remoteVal, setLocalVal] as const;
}

export { EventProvider, useEventClient };

```


eventServer.ts

```ts

import dotenv from "dotenv";
import admin from "firebase-admin";
import { decode } from "js-base64";
dotenv.config();

const EVENT_SERVICE_ACCOUNT_SERVER = process.env.EVENT_SERVICE_ACCOUNT_SERVER!;
const EVENT_DATABASE_URL = process.env.EVENT_DATABASE_URL!;

if (!EVENT_SERVICE_ACCOUNT_SERVER || !EVENT_DATABASE_URL) {
  throw new Error(
    "EVENT_SERVICE_ACCOUNT_SERVER or EVENT_DATABASE_URL not found"
  );
}

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      decode(EVENT_SERVICE_ACCOUNT_SERVER as string)
    );
    const databaseURL = decode(EVENT_DATABASE_URL as string);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

const realtimeDB = admin.database();

// Cache untuk menyimpan listener yang sudah diinisialisasi
const listenerCache: Record<string, boolean> = {};

function eventServer<T>({ projectId }: { projectId: string }) {
  function set<T>(subscribe: T, data: T, onSuccess?: () => void) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);
    ref.set({ data }, (err) => {
      if (err) {
        console.log("Error setting value:", err);
        return;
      }
      onSuccess?.();
    });
  }

  function onChange<T>(subscribe: T, event: (val: T) => void) {
    const refPath = `wibu/${projectId}/${subscribe}`;

    // Cek jika listener sudah ada, jika sudah, skip
    if (listenerCache[refPath]) {
      return;
    }

    const ref = realtimeDB.ref(refPath);

    ref.on("child_changed", (snapshot) => {
      event(snapshot.val());
    });

    // Tandai listener sebagai sudah diinisialisasi
    listenerCache[refPath] = true;

    // Return a cleanup function to remove the listener
    return () => {
      ref.off("child_changed");
      delete listenerCache[refPath]; // Hapus dari cache saat listener dilepas
    };
  }

  return { onChange, set };
}

export { eventServer };

```
