import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const AuthContext = createContext<{ user: User } | null>(null);

interface IProps {
  children?: React.ReactNode;
}

const AuthProvider = ({ children }: IProps) => {
  const auth = getAuth();
  // user null = loading
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkLogin();
  }, []);

  function checkLogin() {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }

  return (
    // @ts-ignore
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
