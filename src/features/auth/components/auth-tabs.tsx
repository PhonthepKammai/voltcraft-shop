import Link from "next/link";

type Tab = "login" | "register";

const TABS: { id: Tab; label: string; href: string }[] = [
  { id: "login", label: "Sign In", href: "/login" },
  { id: "register", label: "Create Account", href: "/register" },
];

export default function AuthTabs({ active }: { active: Tab }) {
  return (
    <div className="grid grid-cols-2 border-b border-slate-800 p-2">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={active === tab.id ? "page" : undefined}
          className={`flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-95 ${
            active === tab.id
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
