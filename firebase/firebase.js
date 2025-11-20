import { initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDV4CpvXWZK1EHEgK26KvNSPsb8kPThYbM",
  authDomain: "proyectoprueba-ebc2a.firebaseapp.com",
  projectId: "proyectoprueba-ebc2a",
  storageBucket: "proyectoprueba-ebc2a.firebasestorage.app",
  messagingSenderId: "870518410654",
  appId: "1:870518410654:web:93c548d089591cb1731a8f",
  measurementId: "G-DLBCNVKM0Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)