import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if present, otherwise default
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { onAuthStateChanged };

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

// Structured error handling as specified in security guidelines
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    if (auth.currentUser) {
      await getDocFromServer(doc(db, 'users', auth.currentUser.uid));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears to be offline.');
    }
  }
}

// Auth Helper Functions
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Guardar o sincronizar perfil de usuario
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      displayName: user.displayName || 'Usuario',
      email: user.email,
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
}

export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error al iniciar sesión con email:', error);
    throw error;
  }
}

export async function registerWithEmail(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      displayName: displayName || user.email.split('@')[0],
      email: user.email,
      photoURL: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return user;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error al solicitar restablecimiento de clave:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

// Firestore Database Projects Helper Functions
export async function guardarProyectoEnFirestore(userId, proyectoData) {
  const projectId = proyectoData.id || `proj_${Date.now()}`;
  const path = `users/${userId}/projects/${projectId}`;
  
  const payload = {
    id: projectId,
    userId: userId,
    nombre: (proyectoData.nombre || 'Rack Sin Nombre').slice(0, 150),
    rackAltura: String(proyectoData.rackAltura || '42U').slice(0, 10),
    elementos: typeof proyectoData.elementos === 'string' ? proyectoData.elementos : JSON.stringify(proyectoData.elementos || []),
    consumoTotal: Number(proyectoData.consumoTotal || 0),
    pesoTotal: Number(proyectoData.pesoTotal || 0),
    precioTotal: Number(proyectoData.precioTotal || 0),
    notas: (proyectoData.notas || '').slice(0, 1000),
    createdAt: proyectoData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', userId, 'projects', projectId), payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function cargarProyectosDeFirestore(userId) {
  const path = `users/${userId}/projects`;
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'projects'));
    const proyectos = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      proyectos.push({
        ...data,
        elementos: typeof data.elementos === 'string' ? JSON.parse(data.elementos) : data.elementos,
        fecha: data.updatedAt || data.createdAt
      });
    });
    // Ordenar de más reciente a más antiguo
    return proyectos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function eliminarProyectoDeFirestore(userId, projectId) {
  const path = `users/${userId}/projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
