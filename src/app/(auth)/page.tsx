"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Zap,
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  CheckCircle2,
  Store,
  Package,
  LayoutDashboard,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Building2,
  ChevronRight,
  ShoppingBag,
  Users,
  Activity,
  X,
  AlertCircle,
  Clock,
  Settings,
  ScanBarcode,
  FileText,
  BadgeCheck,
  Fingerprint,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================


type AuthView = "login" | "register" | "gateway" | "portal";

// ============================================================
// MAIN PAGE
// ============================================================

export default function VoltCraftAuthPage() {
  // Navigation
  const [view, setView] = useState<AuthView>("login");

  // Authentication
  const [users, setUsers] =
    useState<UserAccount[]>(INITIAL_USERS);

  const [currentUser, setCurrentUser] =
    useState<UserAccount | null>(null);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  // Notification
  const [toast, setToast] = useState<ToastData | null>(null);

  // Loading
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

  // ==========================================================
  // HELPERS
  // ==========================================================

  const showToast = (
    message: string,
    type: ToastType = "success"
  ) => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast((current) =>
        current?.message === message ? null : current
      );
    }, 3500);
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const passwordStrengthLabels = [
    "",
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  // ==========================================================
  // LOGIN
  // ==========================================================

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
      setTimeout(resolve, 700)
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

  // ==========================================================
  // DEMO LOGIN
  // ==========================================================

  const fillDemoAccount = (email: string) => {
    setLoginEmail(email);
    setLoginPassword("password123");

    showToast(
      "Demo credentials filled successfully.",
      "info"
    );
  };

  // ==========================================================
  // REGISTRATION
  // ==========================================================

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
      setTimeout(resolve, 700)
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

  // ==========================================================
  // ROLE NAVIGATION
  // ==========================================================

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
    setToast(null);
  };

  // ==========================================================
  // SHARED COMPONENTS
  // ==========================================================



  const PasswordToggle = ({
    visible,
    onToggle,
  }: {
    visible: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );


  // ==========================================================
  // LOGIN VIEW
  // ==========================================================

  const LoginView = () => (
    <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        <AuthTabs active="login" />

        <div className="p-5 sm:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <KeyRound size={22} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Sign in to access your VoltCraft account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClass}>
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) =>
                    setLoginEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-semibold text-slate-200">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Please contact support to reset your password.",
                      "info"
                    )
                  }
                  className="min-h-11 px-1 text-xs font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(event) =>
                    setLoginPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputClass} pl-11 pr-12`}
                  required
                />

                <PasswordToggle
                  visible={showLoginPassword}
                  onToggle={() =>
                    setShowLoginPassword(!showLoginPassword)
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 border-t border-slate-700 pt-6">
            <div className="mb-4 flex flex-col gap-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Quick Demo Logins
              </h3>

              <p className="text-xs text-slate-400">
                Click to auto-fill demo credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() =>
                    fillDemoAccount(account.email)
                  }
                  className={`flex min-h-[68px] items-center gap-3 rounded-xl border p-3 text-left transition-all active:scale-95 ${
                    loginEmail === account.email
                      ? "border-amber-500/60 bg-amber-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <div className={account.color}>
                    {account.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-100">
                      {account.label}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-slate-400">
                      {account.description}
                    </p>
                  </div>

                  {loginEmail === account.email && (
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-amber-400"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950 p-3">
              <p className="text-center text-xs text-slate-300">
                Demo password:{" "}
                <span className="font-mono font-bold text-amber-400">
                  password123
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-slate-300">
        New to VoltCraft?{" "}
        <button
          type="button"
          onClick={() => switchView("register")}
          className="min-h-11 font-bold text-amber-400 hover:text-amber-300"
        >
          Create an account
        </button>
      </p>
    </section>
  );

  // ==========================================================
  // REGISTRATION VIEW
  // ==========================================================

  const RegisterView = () => {
    const strength = getPasswordStrength(registerPassword);

    return (
      <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
          <AuthTabs active="register" />

          <div className="p-5 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <User size={22} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Join VoltCraft and explore smarter power solutions.
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(event) =>
                      setRegisterEmail(event.target.value)
                    }
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showRegisterPassword ? "text" : "password"
                    }
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className={`${inputClass} pl-11 pr-12`}
                    minLength={8}
                    required
                  />

                  <PasswordToggle
                    visible={showRegisterPassword}
                    onToggle={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                  />
                </div>

                {registerPassword && (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-300">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          strength <= 2
                            ? "text-red-400"
                            : strength <= 3
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {passwordStrengthLabels[strength]}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            strength >= level
                              ? strength <= 2
                                ? "bg-red-500"
                                : strength <= 3
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`${inputClass} pl-11 pr-12`}
                    required
                  />

                  <PasswordToggle
                    visible={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </div>

                {confirmPassword && (
                  <div
                    className={`mt-2 flex items-center gap-2 text-xs ${
                      registerPassword === confirmPassword
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {registerPassword === confirmPassword ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}

                    {registerPassword === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>

              {/* Corporate Registration */}
              <label className="flex min-h-[80px] cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-slate-500">
                <input
                  type="checkbox"
                  checked={isCorporateStaff}
                  onChange={(event) =>
                    setIsCorporateStaff(event.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-amber-500"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={17}
                      className="shrink-0 text-amber-400"
                    />

                    <span className="text-sm font-bold text-slate-100">
                      Register as Corporate Staff / Partner
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Register your interest in corporate access.
                    Additional staff permissions require administrator
                    verification.
                  </p>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-bold text-slate-950 transition-all hover:bg-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create VoltCraft Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-relaxed text-slate-400">
                By creating an account, you agree to our Terms of
                Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => switchView("login")}
            className="min-h-11 font-bold text-amber-400 hover:text-amber-300"
          >
            Sign in
          </button>
        </p>
      </section>
    );
  };

  // ==========================================================
  // MULTI-ROLE GATEWAY
  // ==========================================================

  const GatewayView = () => {
    if (!currentUser) return null;

    return (
      <section className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.12)]">
            <LayoutDashboard size={29} />
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="flex min-h-7 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 size={12} />
              Authenticated
            </span>

            <span className="flex min-h-7 items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300">
              <Shield size={12} />
              Multi-Role Account
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back,{" "}
            <span className="text-amber-400">
              {currentUser.name.split(" ")[0]}
            </span>
            !
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
            Select your operational session context for this login.
            Your account has access to multiple VoltCraft environments.
          </p>
        </div>

        {/* Account Summary */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-400">
              <User size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {currentUser.name}
              </p>

              <p className="truncate text-xs text-slate-300">
                {currentUser.email}
              </p>

              {currentUser.department && (
                <p className="mt-1 truncate text-[10px] text-slate-400">
                  {currentUser.department}
                </p>
              )}
            </div>
          </div>

          <div className="flex min-h-9 items-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-950 px-3 sm:self-auto">
            <Shield size={14} className="text-amber-400" />

            <span className="text-xs font-semibold text-slate-200">
              {currentUser.roles.length} Assigned Roles
            </span>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentUser.roles.map((role) => {
            const config = ROLE_CONFIG[role];

            return (
              <article
                key={role}
                className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-500 hover:shadow-xl hover:shadow-black/20 sm:p-6"
              >
                {/* Card Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconClass}`}
                  >
                    {config.icon}
                  </div>

                  <span
                    className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}
                  >
                    {role}
                  </span>
                </div>

                {/* Card Information */}
                <div className="mb-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {config.subtitle}
                  </p>

                  <h3 className="text-lg font-bold text-white">
                    {config.title}
                  </h3>
                </div>

                <p className="mb-6 min-h-[48px] text-sm leading-relaxed text-slate-300">
                  {config.description}
                </p>

                {/* Permissions */}
                <div className="mb-6 flex-1 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Available Permissions
                  </p>

                  {config.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-start gap-2 text-xs text-slate-200"
                    >
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <span>{permission}</span>
                    </div>
                  ))}
                </div>

                {/* Entry Button */}
                <button
                  type="button"
                  onClick={() =>
                    enterRole(role, currentUser)
                  }
                  className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${config.buttonClass}`}
                >
                  Enter Portal
                  <ArrowRight size={17} />
                </button>
              </article>
            );
          })}
        </div>

        {/* Gateway Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Lock size={15} className="shrink-0 text-slate-400" />

            <span>
              Access is controlled by assigned account permissions.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-200 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 active:scale-95 sm:w-auto"
          >
            <LogOut size={17} />
            Sign Out / Switch Account
          </button>
        </div>
      </section>
    );
  };

  // ==========================================================
  // PORTAL PREVIEW
  // ==========================================================

  const PortalView = () => {
    if (!currentUser || !selectedRole) return null;

    const config = ROLE_CONFIG[selectedRole];

    const moduleIcons = [
      <LayoutDashboard key="dashboard" size={18} />,
      <Package key="package" size={18} />,
      <Users key="users" size={18} />,
    ];

    return (
      <section className="mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
          {/* Portal Header */}
          <div className="border-b border-slate-700 p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <Zap size={23} />
                </div>

                <div>
                  <p className="font-extrabold text-white">
                    VoltCraft
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Operational Portal
                  </p>
                </div>
              </div>

              <span
                className={`rounded-lg border px-3 py-2 text-[10px] font-bold uppercase ${config.badgeClass}`}
              >
                {selectedRole}
              </span>
            </div>

            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconClass}`}
            >
              {config.icon}
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              Session Active
            </p>

            <h2 className="text-2xl font-extrabold sm:text-3xl">
              {config.title}
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Welcome, {currentUser.name}.
            </p>
          </div>

          {/* Portal Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-7 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Activity
                  size={17}
                  className="text-emerald-400"
                />

                <span className="text-sm font-bold text-emerald-300">
                  Portal Access Confirmed
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-300">
                You are currently operating in the{" "}
                <span className="font-bold text-white">
                  {config.title}
                </span>{" "}
                context. This page is a frontend demonstration of
                the role-based portal entry.
              </p>
            </div>

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Available Modules
              </h3>

              <span className="text-xs text-slate-400">
                {config.features.length} modules
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {config.features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex min-h-[110px] flex-col justify-between rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-slate-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                      {moduleIcons[index]}
                    </div>

                    <ChevronRight
                      size={16}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-4 text-xs font-bold text-slate-200">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* Session Information */}
            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200">
                  Current Account
                </p>

                <p className="mt-1 truncate text-xs text-slate-300">
                  {currentUser.email}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active Session
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {currentUser.roles.length > 1 && (
                <button
                  type="button"
                  onClick={handleSwitchRole}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 text-sm font-bold text-slate-200 transition hover:bg-slate-800 active:scale-95"
                >
                  <LayoutDashboard size={17} />
                  Switch Role
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 text-sm font-bold text-slate-950 transition hover:bg-amber-400 active:scale-95"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>

            <div className="mt-5 text-center">
              <span className="break-all text-[10px] text-slate-400">
                Destination: {config.destination}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
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
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-3 rounded-xl border bg-slate-900 p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-emerald-500/40"
                : toast.type === "error"
                  ? "border-red-500/40"
                  : "border-blue-500/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2
                size={20}
                className="shrink-0 text-emerald-400"
              />
            ) : toast.type === "error" ? (
              <AlertCircle
                size={20}
                className="shrink-0 text-red-400"
              />
            ) : (
              <Activity
                size={20}
                className="shrink-0 text-blue-400"
              />
            )}

            <p className="min-w-0 flex-1 text-sm text-slate-100">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {/* Brand Header */}
        {view !== "portal" && <BrandHeader />}

        {/* Login */}
        {view === "login" && <LoginView />}

        {/* Registration */}
        {view === "register" && <RegisterView />}

        {/* Multi-Role Gateway */}
        {view === "gateway" && <GatewayView />}

        {/* Portal Preview */}
        {view === "portal" && (
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

            <PortalView />
          </>
        )}

        {/* Footer */}
        <GlobalFooter />
      </div>
    </main>
  );
}