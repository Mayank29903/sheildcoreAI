import { useState, useEffect } from 'react';
import { onAuthChange, signInWithGoogle, continueAsGuest, logOut, signInWithEmail, registerWithEmail } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signIn: signInWithGoogle,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    continueAsGuest,
    signOut: logOut,
  };
}
