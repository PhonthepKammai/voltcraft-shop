"use client";

import { useState, type FormEvent } from "react";
import { Zap } from "lucide-react";

import {
  type Role,
  type AuthView,
  type ToastType,
  type UserAccount,
  type ToastData,
} from "./types";
import { INITIAL_USERS, ROLE_CONFIG } from "./constants";
import { BrandHeader } from "./components/BrandHeader";
import { GlobalFooter } from "./components/GlobalFooter";
import { ToastNotification } from "./components/ToastNotification";
import { LoginView } from "./components/LoginView";
import { RegisterView } from "./components/RegisterView";
import { GatewayView } from "./components/GatewayView";
import { PortalView } from "./components/PortalView";

export default function VoltCraftAuthPage() {
  // Navigation
  const [view, setView] = useState<AuthView>("login");

  // Authentication
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Notification
  const [toast, setToast] = useState<ToastData | null>(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCorporateStaff, setIsCorporateStaff] = useState(false);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast((current) =>
        current?.message === message ? null : current
      );
    }, 3500);
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginEmail.trim() || !loginPassword) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const user = users.find(
      (account) =>
        account.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
        account.password === loginPassword
    );

    setIsLoading(false);

    if (!user) {
      showToast("Invalid email address or password.", "error");
      return;
    }

    setCurrentUser(user);

    if (user.roles.length > 1) {
      setSelectedRole(null);
      setView("gateway");

      showToast(
        "Login successful. Select your operational context.",
        "success"
      );

      return;
    }

    const role = user.roles[0];

    if (role) {
      enterRole(role, user);
    }
  };

  // ==========================================================
  // REGISTRATION
  // ==========================================================

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      showToast("Please enter your full name.", "error");
      return;
    }

    if (!isValidEmail(registerEmail)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (registerPassword.length < 8) {
      showToast("Password must contain at least 8 characters.", "error");
      return;
    }

    if (registerPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === registerEmail.trim().toLowerCase()
    );

    if (emailExists) {
      showToast("An account with this email already exists.", "error");
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const newUser: UserAccount = {
      id: `VC-${Date.now()}`,
      name: fullName.trim(),
      email: registerEmail.trim().toLowerCase(),
      password: registerPassword,
      roles: ["customer"],
      corporateRegistration: isCorporateStaff,
      ...(isCorporateStaff
        ? {
            department: "Corporate Partner - Pending Verification",
          }
        : {}),
    };

    setUsers((previous) => [...previous, newUser]);

    setIsLoading(false);

    setLoginEmail(newUser.email);
    setLoginPassword("");

    setFullName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setIsCorporateStaff(false);

    setView("login");

    showToast("Account created successfully. Please sign in.", "success");
  };

  // ==========================================================
  // ROLE NAVIGATION
  // ==========================================================

  const enterRole = (role: Role, user: UserAccount) => {
    if (!user.roles.includes(role)) {
      showToast("You do not have permission to access this portal.", "error");
      return;
    }

    setCurrentUser(user);
    setSelectedRole(role);
    setView("portal");

    showToast(`Entering ${ROLE_CONFIG[role].title}...`, "success");
  };

  const handleSwitchRole = () => {
    if (!currentUser) return;

    if (currentUser.roles.length > 1) {
      setSelectedRole(null);
      setView("gateway");
    } else {
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setSelectedRole(null);

    setLoginEmail("");
    setLoginPassword("");

    setView("login");

    showToast("You have signed out successfully.", "success");
  };

  const switchView = (nextView: "login" | "register") => {
    setView(nextView);
    setToast(null);
  };

  // ==========================================================
  // MAIN RENDER
  // ==========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-amber-500/30">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Toast Notification */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {/* Brand Header */}
        {view !== "portal" && <BrandHeader />}

        {/* Login */}
        {view === "login" && (
          <LoginView
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            isLoading={isLoading}
            onLogin={handleLogin}
            onSwitchView={switchView}
            showToast={showToast}
          />
        )}

        {/* Registration */}
        {view === "register" && (
          <RegisterView
            fullName={fullName}
            setFullName={setFullName}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerPassword={registerPassword}
            setRegisterPassword={setRegisterPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isCorporateStaff={isCorporateStaff}
            setIsCorporateStaff={setIsCorporateStaff}
            isLoading={isLoading}
            onRegister={handleRegister}
            onSwitchView={switchView}
          />
        )}

        {/* Multi-Role Gateway */}
        {view === "gateway" && currentUser && (
          <GatewayView
            currentUser={currentUser}
            onEnterRole={enterRole}
            onSignOut={handleSignOut}
          />
        )}

        {/* Portal Preview */}
        {view === "portal" && currentUser && selectedRole && (
          <>
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Zap size={23} />
                </div>

                <div>
                  <p className="text-xl font-extrabold">
                    Volt<span className="text-amber-500">Craft</span>
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Operational Environment
                  </p>
                </div>
              </div>
            </div>

            <PortalView
              currentUser={currentUser}
              selectedRole={selectedRole}
              onSwitchRole={handleSwitchRole}
              onSignOut={handleSignOut}
            />
          </>
        )}

        {/* Footer */}
        <GlobalFooter />
      </div>
    </main>
  );
}
