import React, {useEffect, useState, createContext, useContext} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

interface AuthContextType {
  user: User | null;
  register: (
    email: string,
    password: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/* interface User {
  email: string,
  password: string,
  displayName: string;
  photoURL: string;
  // Otras propiedades del usuario
} */

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        setUser(user);
        console.log("ingreso", user)
      }else{
        setUser(null);
        console.log("ingreso", null)
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
 /*  useEffect(() => {
    const suscribed = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("no ingreso", currentUser);
        setUser("");
      } else {
        setUser(currentUser);
        console.log("ingreso", currentUser);
      }
    });
    return () => suscribed();
  }, []);  */

  const register = async (
    email: string,
    password: string,
  ) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

     /*  if (!response) {
        throw new Error("Ocurrio un error al registrarse");
      } else {
        return response;
      } */
    } catch (error: any) {
      return error.message;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      return error.message;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => sendPasswordResetEmail(auth, email)

  const authContextValue: AuthContextType = {
    user,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};


/* import { auth } from "../firebase/firebase.config";
import { createContext, useContext } from "react";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if(!context){
    console.log("error creating auth context");
  }
  return context;
};

export function AuthProvider({children}){
  
  return 
  <authContext.Provider>
    {children}
  </authContext.Provider>
}
 */
