'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


export function initializeFirebase() {

  if (!getApps().length) {

    const firebaseApp = initializeApp(firebaseConfig);

    return getSdks(firebaseApp);

  }

  return getSdks(getApp());

}



export function getSdks(firebaseApp: FirebaseApp) {

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };

}



// Firebase React provider y hooks
export * from './provider';


// Cliente Firebase
export * from './client-provider';


// Firestore hooks
export * from './firestore/use-collection';
export * from './firestore/use-doc';


// Firebase helpers
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';