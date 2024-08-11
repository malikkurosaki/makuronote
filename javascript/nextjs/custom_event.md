# Custom Event

dep:

- firebase
- firebase-admin
- js-base64
- dotenv

encod semua service accunt dan database url lalu masukkan ke env

.env 
```.env
EVENT_DATABASE_URL=
EVENT_SERVICE_ACCOUNT_SERVER=
EVENT_SERVICE_ACCOUNT_CLIENT=
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
export function useEventClient({
  config,
  projectId,
  subscribe,
}: {
  config: string;
  projectId: string;
  subscribe: string;
}) {
  if (!config) {
    throw new Error("config not found");
  }

  const appConfig = JSON.parse(decode(config));
  let app: FirebaseApp;

  // Inisialisasi Firebase App
  if (getApps().length === 0) {
    app = initializeApp(appConfig);
  } else {
    app = getApp();
  }

  const db = getDatabase(app);
  const eventRef = ref(db, `wibu/${projectId}/${subscribe}`);

  // Gunakan useCallback untuk mencegah fungsi berubah antara render
  const onRefresh = useCallback(
    (callback: () => void) => onValue(eventRef, callback),
    [eventRef]
  );

  const onChange = useCallback(
    (callback: () => void) => onChildChanged(eventRef, callback),
    [eventRef]
  );

  const setRefresh = useCallback(() => {
    set(eventRef, { data: Math.random() });
  }, [eventRef]);

  useEffect(() => {
    // Panggil fungsi onUpdate untuk mendengarkan perubahan data dan dapatkan unsubscribe
    const unsubscribe = onRefresh(() => {});

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [onRefresh]);

  return [onRefresh, setRefresh, onChange] as const;
}

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
    "FIREBASE_SERVICE_ACCOUNT or FIREBASE_DATABASE_URL not found"
  );
}

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    decode(EVENT_SERVICE_ACCOUNT_SERVER as string)
  );
  const databaseURL = decode(EVENT_DATABASE_URL as string);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  });
}

const realtimeDB = admin.database();

function eventServer({
  subscribe,
  projectId,
}: {
  projectId: string;
  subscribe: string;
}) {
  function onUpdate(event: () => void) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);

    ref.on("value", (snapshot) => {
      event();
    });

    // Return a cleanup function to remove the listener
    return () => ref.off();
  }

  function update(onSuccess?: () => void) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);
    ref.set({ data: Math.random() }, (err) => {
      if (err) {
        console.log("Error setting value:", err);
        return;
      }
      onSuccess?.();
    });
  }

  function onChange(event: () => void) {
    const ref = realtimeDB.ref(`wibu/${projectId}/${subscribe}`);
    ref.on("child_changed", (snapshot) => {
      event();
    });
  }

  return [onUpdate, update, onChange] as const;
}

export { eventServer };

```
