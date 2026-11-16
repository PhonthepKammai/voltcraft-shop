import { useState, type FormEvent } from "react";
import { FAKE_NETWORK_DELAY_MS } from "../constants";
import { INITIAL_USERS } from "../mockData";
import { ROLE_CONFIG } from "../roleConfig";
import type { AuthView, Role, ShowToast, UserAccount } from "../types";
import { isValidEmail } from "../utils";

export function useAuth(showToast: ShowToast, dismissToast: () => void) {
  const [view, setView] = useState<AuthView>("login");

  // Authentication
  const [users, setUsers] =
    useState<UserAccount[]>(INITIAL_USERS);

  const [currentUser, setCurrentUser] =
    useState<UserAccount | null>(null);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  const [isLoading, setIsLoading] = useState(false);


  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  // Registration form
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isCorporateStaff, setIsCorporateStaff] =
    useState(false);

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!loginEmail.trim() || !loginPassword) {
      showToast(
        "Please complete all required fields.",
        "error"
      );
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showToast(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, FAKE_NETWORK_DELAY_MS)
    );

    const user = users.find(
      (account) =>
        account.email.toLowerCase() ===
          loginEmail.trim().toLowerCase() &&
        account.password === loginPassword
    );

    setIsLoading(false);

    if (!user) {
      showToast(
        "Invalid email address or password.",
        "error"
      );
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

  const fillDemoAccount = (email: string) => {
    setLoginEmail(email);
    setLoginPassword("password123");

    showToast(
      "Demo credentials filled successfully.",
      "info"
    );
  };

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!fullName.trim()) {
      showToast("Please enter your full name.", "error");
      return;
    }

    if (!isValidEmail(registerEmail)) {
      showToast(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    if (registerPassword.length < 8) {
      showToast(
        "Password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (registerPassword !== confirmPassword) {
      showToast(
        "Passwords do not match.",
        "error"
      );
      return;
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        registerEmail.trim().toLowerCase()
    );

    if (emailExists) {
      showToast(
        "An account with this email already exists.",
        "error"
      );
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, FAKE_NETWORK_DELAY_MS)
    );

    const newUser: UserAccount = {
      id: `VC-${Date.now()}`,
      name: fullName.trim(),
      email: registerEmail.trim().toLowerCase(),
      password: registerPassword,
      roles: ["customer"],
      corporateRegistration: isCorporateStaff,
      ...(isCorporateStaff
        ? {
            department:
              "Corporate Partner - Pending Verification",
          }
        : {}),
    };

    // Corporate registration does not automatically grant
    // staff permissions. An administrator must assign roles.

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

    showToast(
      "Account created successfully. Please sign in.",
      "success"
    );
  };

  const enterRole = (
    role: Role,
    user: UserAccount
  ) => {
    if (!user.roles.includes(role)) {
      showToast(
        "You do not have permission to access this portal.",
        "error"
      );
      return;
    }

    setCurrentUser(user);
    setSelectedRole(role);
    setView("portal");

    showToast(
      `Entering ${ROLE_CONFIG[role].title}...`,
      "success"
    );
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

    showToast(
      "You have signed out successfully.",
      "success"
    );
  };

  const switchView = (nextView: "login" | "register") => {
    setView(nextView);
    dismissToast();
  };

  return {
    view,
    setView,
    users,
    currentUser,
    selectedRole,
    isLoading,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    fullName,
    setFullName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    confirmPassword,
    setConfirmPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isCorporateStaff,
    setIsCorporateStaff,
    handleLogin,
    fillDemoAccount,
    handleRegister,
    enterRole,
    handleSwitchRole,
    handleSignOut,
    switchView,
  };
}

export type AuthApi = ReturnType<typeof useAuth>;
