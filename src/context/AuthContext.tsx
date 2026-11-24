"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@/app/portal/auth/hooks/useAuth";
import { useToast } from "@/app/hooks/useToast";

type AuthContextType = ReturnType<typeof useAuth> & {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showToast, dismissToast } = useToast();
  const auth = useAuth(showToast, dismissToast);

  return (
    <AuthContext.Provider value={{ ...auth, showToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext ต้องถูกเรียกใช้ภายใน <AuthProvider>");
  }
  return context;
}