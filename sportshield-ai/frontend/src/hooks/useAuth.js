import { useState, useEffect } from 'react';
import { onAuthChange, signInWithGoogle, logOut } from '../lib/firebase';

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

  return { user, loading, signIn: signInWithGoogle, signOut: logOut };
}
