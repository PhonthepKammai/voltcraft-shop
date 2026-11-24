"use client";

import { Lock, Mail, ArrowRight, KeyRound, Home } from "lucide-react";
import { INPUT_CLASS, LABEL_CLASS } from "../constants";
import { useAuthContext } from "@/context/AuthContext";
import AuthTabs from "./AuthTabs";
import PasswordToggle from "./ui/PasswordToggle";


export default function LoginView() {

  const auth = useAuthContext();
  const {
    showToast,
    isLoading,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    handleLogin,
    switchView,
  } = auth;

  return (
    <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* <AuthTabs active="login" onSwitch={switchView} /> */}
        <div className="flex justify-between border-b border-slate-800 p-4 gap-4">
          <div className="flex gap-4 items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <KeyRound size={22} />
            </div>
            <h2 className="text-2xl font-bold">
              Sign In
            </h2>
          </div>
          <span className="flex items-center text-sm">
            ← Back to Store
          </span>
        </div>

        <div className="p-5 sm:p-8">

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
