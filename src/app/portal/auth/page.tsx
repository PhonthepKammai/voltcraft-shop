"use client";

import BackgroundDecor from "./components/BackgroundDecor";
import BrandHeader from "./components/BrandHeader";
import GatewayView from "./components/GatewayView";
import GlobalFooter from "./components/GlobalFooter";
import LoginView from "./components/LoginView";
import PortalBrand from "./components/PortalBrand";
import PortalView from "./components/PortalView";
import RegisterView from "./components/RegisterView";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/app/hooks/useToast";
import { useAuthContext } from "@/context/AuthContext";

export default function VoltCraftAuthPage() {
  const { toast, dismissToast } = useToast();
  const { view } = useAuthContext();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-amber-500/30">
      <BackgroundDecor />
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {view !== "portal" && <BrandHeader />}

        {view === "login" && <LoginView />}
        {view === "register" && <RegisterView />}
        {view === "gateway" && (<GatewayView />)}

        {view === "portal" && (
          <>
            <PortalBrand />
            <PortalView />
          </>
        )}

        <GlobalFooter />
      </div>
    </main>
  );
}
