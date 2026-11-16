"use client";

import BackgroundDecor from "./components/BackgroundDecor";
import BrandHeader from "./components/BrandHeader";
import GatewayView from "./components/GatewayView";
import GlobalFooter from "./components/GlobalFooter";
import LoginView from "./components/LoginView";
import PortalBrand from "./components/PortalBrand";
import PortalView from "./components/PortalView";
import RegisterView from "./components/RegisterView";
import Toast from "./components/ui/Toast";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./hooks/useToast";

export default function VoltCraftAuthPage() {
  const { toast, showToast, dismissToast } = useToast();
  const auth = useAuth(showToast, dismissToast);
  const { view, currentUser, selectedRole, enterRole, handleSwitchRole, handleSignOut } =
    auth;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-amber-500/30">
      <BackgroundDecor />

      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {view !== "portal" && <BrandHeader />}

        {view === "login" && <LoginView auth={auth} showToast={showToast} />}

        {view === "register" && <RegisterView auth={auth} />}

        {view === "gateway" && (
          <GatewayView
            currentUser={currentUser}
            enterRole={enterRole}
            handleSignOut={handleSignOut}
          />
        )}

        {view === "portal" && (
          <>
            <PortalBrand />
            <PortalView
              currentUser={currentUser}
              selectedRole={selectedRole}
              handleSwitchRole={handleSwitchRole}
              handleSignOut={handleSignOut}
            />
          </>
        )}

        <GlobalFooter />
      </div>
    </main>
  );
}
