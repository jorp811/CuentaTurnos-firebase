// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
// NOTA: Deberás reemplazar estos valores con tu propia configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZjkpZNIH8t0a82z2o9H6ji643981kW_A",
  authDomain:"turnos-b1af4.firebaseapp.com",
  projectId: "turnos-b1af4",
  storageBucket: "turnos-b1af4.appspot.com",
  messagingSenderId: "288846139606",
  appId: "1:288846139606:web:b057c01a1cf08d40357977"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;