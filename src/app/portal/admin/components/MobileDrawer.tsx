import type { ReactNode } from "react";

interface MobileDrawerProps {
  onClose: () => void;
  children: ReactNode;
}

export default function MobileDrawer({ onClose, children }: MobileDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div
        onClick={() => onClose()}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
      />
      <aside className="relative w-[82vw] max-w-xs bg-slate-950 text-slate-100 h-full border-r border-slate-800 shadow-2xl z-10">
        {children}
      </aside>
    </div>
  );
}
