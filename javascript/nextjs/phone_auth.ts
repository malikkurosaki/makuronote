import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyCWkJC8mvRhC_7IrpF2fPchJGDDwbQo6bM",
    authDomain: "eagle-eye-c93d5.firebaseapp.com",
    projectId: "eagle-eye-c93d5",
    storageBucket: "eagle-eye-c93d5.appspot.com",
    messagingSenderId: "749541703916",
    appId: "1:749541703916:web:592c52f26f2fe18dcfa5c9",
    measurementId: "G-QNZVY544FR"
};

var app;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp()
}

export const authentication = getAuth(app)
