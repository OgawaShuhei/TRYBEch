import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// 設定を取得
const firebaseConfig = {
  apiKey: "AIzaSyCDlOtcOUyPXI1A5B_L1QgyT6xpSF8F3S8",
  authDomain: "trybe-eecda.firebaseapp.com",
  projectId: "trybe-eecda",
  storageBucket: "trybe-eecda.firebasestorage.app",
  messagingSenderId: "190603886366",
  appId: "1:190603886366:web:135233ef3bc8eb5485530f",
  measurementId: "G-5644GXB6QB"
};

// 設定値の検証
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration:', missingKeys);
  console.log('Current environment:', process.env.NODE_ENV);
}

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// 各サービスのインスタンスを取得
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// 開発環境でのみエミュレーターを使用
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  console.log('Firebase Emulatorモードで実行中...');
  connectFirestoreEmulator(db, '127.0.0.1', 8081);
  connectStorageEmulator(storage, '127.0.0.1', 9198);
}

export default app; 