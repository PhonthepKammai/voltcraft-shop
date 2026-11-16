import { Lock, Mail, User, ArrowRight, CheckCircle2, Building2, AlertCircle } from "lucide-react";
import { INPUT_CLASS, LABEL_CLASS } from "../constants";
import type { AuthApi } from "../hooks/useAuth";
import { PASSWORD_STRENGTH_LABELS, getPasswordStrength } from "../utils";
import AuthTabs from "./AuthTabs";
import PasswordToggle from "./ui/PasswordToggle";

interface RegisterViewProps {
  auth: AuthApi;
}

export default function RegisterView({ auth }: RegisterViewProps) {
  const {
    isLoading,
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
    handleRegister,
    switchView,
  } = auth;

  const strength = getPasswordStrength(registerPassword);

  return (
    <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        <AuthTabs active="register" onSwitch={switchView} />

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
              <label className={LABEL_CLASS}>
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
                  className={`${INPUT_CLASS} pl-11`}
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  value={registerEmail}
                  onChange={(event) =>
                    setRegisterEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`${INPUT_CLASS} pl-11`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={LABEL_CLASS}>
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
                  className={`${INPUT_CLASS} pl-11 pr-12`}
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
                      {PASSWORD_STRENGTH_LABELS[strength]}
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
              <label className={LABEL_CLASS}>
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
                  className={`${INPUT_CLASS} pl-11 pr-12`}
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
}
