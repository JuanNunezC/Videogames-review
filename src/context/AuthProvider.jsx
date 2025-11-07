import { createContext, useContext, useEffect, useState } from "react";
import { createSession, ensureCsrf, getProfile, logoutSession } from "../api";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is logged in
  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setUser({
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
          });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const token = await response.user.getIdToken();
      await ensureCsrf();
      await createSession(token);
      setUser({
        uid: response.user.uid,
        name: response.user.displayName,
        email: response.user.email,
        picture: response.user.photoURL,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await ensureCsrf();
      await logoutSession();
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
