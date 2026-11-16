import { Lock, Mail, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { DEMO_ACCOUNTS } from "../demoAccounts";
import { INPUT_CLASS, LABEL_CLASS } from "../constants";
import type { AuthApi } from "../hooks/useAuth";
import type { ShowToast } from "../types";
import AuthTabs from "./AuthTabs";
import PasswordToggle from "./ui/PasswordToggle";

interface LoginViewProps {
  auth: AuthApi;
  showToast: ShowToast;
}

export default function LoginView({ auth, showToast }: LoginViewProps) {
  const {
    isLoading,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    handleLogin,
    fillDemoAccount,
    switchView,
  } = auth;

  return (
    <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        <AuthTabs active="login" onSwitch={switchView} />

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
              <label className={LABEL_CLASS}>
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
                  className={`${INPUT_CLASS} pl-11`}
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
                  className={`${INPUT_CLASS} pl-11 pr-12`}
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
}
