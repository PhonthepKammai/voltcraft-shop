interface AuthTabsProps {
  active: "login" | "register";
  onSwitchView: (nextView: "login" | "register") => void;
}

export function AuthTabs({ active, onSwitchView }: AuthTabsProps) {
  return (
    <div className="grid grid-cols-2 border-b border-slate-800 p-2">
      <button
        type="button"
        onClick={() => onSwitchView("login")}
        className={`min-h-11 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
          active === "login"
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
        }`}
      >
        Sign In
      </button>

      <button
        type="button"
        onClick={() => onSwitchView("register")}
        className={`min-h-11 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
          active === "register"
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
        }`}
      >
        Create Account
      </button>
    </div>
  );
}
