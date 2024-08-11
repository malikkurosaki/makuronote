# Custom Event V2

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

function eventServer<T extends readonly string[]>({
  projectId,
  listSubscribe,
}: {
  projectId: string;
  listSubscribe: T;
}) {
  type Subscribe = T[number];

  function onUpdate({
    subscribe,
    event,
  }: {
    subscribe: Subscribe;
    event: () => void;
  }) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);

    ref.on("value", () => {
      event();
    });

    // Return a cleanup function to remove the listener
    return () => ref.off("value");
  }

  function update({
    subscribe,
    onSuccess,
  }: {
    subscribe: Subscribe;
    onSuccess?: () => void;
  }) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);
    ref.set({ data: Math.random() }, (err) => {
      if (err) {
        console.log("Error setting value:", err);
        return;
      }
      onSuccess?.();
    });
  }

  function onChange({
    subscribe,
    event,
  }: {
    subscribe: Subscribe;
    event: () => void;
  }) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);
    ref.on("child_changed", (snapshot) => {
      event();
    });

    // Return a cleanup function to remove the listener
    return () => ref.off("child_changed");
  }

  return { onUpdate, update, onChange };
}

export { eventServer };


```

eventClient.ts

```ts
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  getDatabase,
  onChildChanged,
  onValue,
  ref,
  set,
} from "firebase/database";
import { decode } from "js-base64";
import { useCallback, useEffect } from "react";

// Hook untuk digunakan pada komponen React
export function useEventClient<T extends readonly string[]>({
  config,
  projectId,
  listSubscribe,
}: {
  config: string;
  projectId: string;
  listSubscribe: T;
}) {
  type Subscribe = T[number];
  if (!config) {
    throw new Error("config not found");
  }

  const appConfig = JSON.parse(decode(config));
  let app: FirebaseApp;

  // Inisialisasi Firebase App jika belum ada
  if (getApps().length === 0) {
    app = initializeApp(appConfig);
  } else {
    app = getApp();
  }

  const db = getDatabase(app);

  // Gunakan useCallback untuk mencegah fungsi berubah antara render
  const onRefresh = useCallback(
    (subscribe: Subscribe, callback: (snapshot: any) => void) => {
      const reference = ref(db, `wibu/${projectId}/${subscribe}`);
      return onValue(reference, callback);
    },
    [db, projectId]
  );

  const onChange = useCallback(
    (subscribe: Subscribe, callback: (snapshot: any) => void) => {
      const reference = ref(db, `wibu/${projectId}/${subscribe}`);
      return onChildChanged(reference, callback);
    },
    [db, projectId]
  );

  const setRefresh = useCallback(
    (subscribe: Subscribe) => {
      const reference = ref(db, `wibu/${projectId}/${subscribe}`);
      return set(reference, { data: Math.random() });
    },
    [db, projectId]
  );

  useEffect(() => {
    const unsubscribeList = listSubscribe.map((subscribe) =>
      onRefresh(subscribe, () => {
        // Implement callback here
        // console.log(`${subscribe} has been refreshed`);
      })
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe());
    };
  }, [listSubscribe, onRefresh]);

  return [onRefresh, setRefresh, onChange] as const;
}

```
