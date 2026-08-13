import { auth, db, isFirebaseConfigured } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LOCAL_USER_KEY = 'campusevent_current_user';

export const getCurrentLocalUser = () => {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentLocalUser = (user) => {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

export const registerUser = async (name, email, password, role = 'user') => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    
    // Save role in Firestore
    if (db) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      });
    }

    return {
      uid: user.uid,
      name: name,
      email: email,
      role: role
    };
  } else {
    // Demo Mode
    const user = {
      uid: 'user-' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      role: role
    };
    setCurrentLocalUser(user);
    return user;
  }
};

export const loginUser = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    let role = 'user';

    // Fetch user profile/role from Firestore
    if (db) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        role = userDoc.data().role || 'user';
      }
    }

    return {
      uid: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email,
      role: role
    };
  } else {
    // Demo Mode logic: email containing "admin" gets Admin role
    const isAdmin = email.toLowerCase().includes('admin');
    const user = {
      uid: isAdmin ? 'admin-123' : 'user-' + Date.now(),
      name: isAdmin ? 'System Administrator' : email.split('@')[0],
      email: email,
      role: isAdmin ? 'admin' : 'user'
    };
    setCurrentLocalUser(user);
    return user;
  }
};

export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  setCurrentLocalUser(null);
};

export const onAuthChange = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = 'user';
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role || 'user';
            }
          } catch (e) {
            console.error("Error fetching user role from firestore", e);
          }
        }
        callback({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          role: role
        });
      } else {
        callback(null);
      }
    });
  } else {
    // Demo Mode listener
    const localUser = getCurrentLocalUser();
    callback(localUser);
    return () => {};
  }
};

export const loginAsDemoUser = () => {
  const user = {
    uid: 'demo-student-101',
    name: 'Alex Johnson (Student)',
    email: 'alex.student@college.edu',
    role: 'user'
  };
  setCurrentLocalUser(user);
  return user;
};

export const loginAsDemoAdmin = () => {
  const admin = {
    uid: 'demo-admin-999',
    name: 'Dr. Sarah Connor (Admin)',
    email: 'admin.events@college.edu',
    role: 'admin'
  };
  setCurrentLocalUser(admin);
  return admin;
};
