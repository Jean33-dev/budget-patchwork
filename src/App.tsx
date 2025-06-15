import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Categories from "./pages/Categories";
import BudgetTransition from "./pages/BudgetTransition";
import Settings from "./pages/Settings";
import { useEffect, useState } from "react";
import { PINSetup } from "@/components/auth/PINSetup";
import { PINUnlock } from "@/components/auth/PINUnlock";
import { usePinProtection } from "@/hooks/usePinProtection"; // <-- Hook ONLY

const queryClient = new QueryClient();

// Composant pour gérer l'affichage conditionnel du Footer
const AppContent = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/' && location.pathname !== '/settings';

  // On applique un padding plus large quand le footer est présent, sinon plus petit
  const paddingBottom = showFooter ? "pb-36" : "pb-8";

  return (
    <>
      <div className={paddingBottom}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
          <Route path="/dashboard/:dashboardId/budgets" element={<Budgets />} />
          <Route path="/dashboard/:dashboardId/expenses" element={<Expenses />} />
          <Route path="/dashboard/:dashboardId/income" element={<Income />} />
          <Route path="/dashboard/:dashboardId/categories" element={<Categories />} />
          <Route path="/dashboard/:dashboardId/transition" element={<BudgetTransition />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

function ProtectedApp() {
  // Utilisation du hook pour obtenir state PIN
  const { hasPin, locked, lock } = usePinProtection();
  const [pinState, setPinState] = useState<"setup" | "unlock" | "open">("open");

  useEffect(() => {
    // On attend d'avoir l'info pin chargée (locked peut être null au début)
    if (hasPin === undefined || locked === null) return;
    if (!hasPin) setPinState("setup");
    else if (locked) setPinState("unlock");
    else setPinState("open");
  }, [hasPin, locked]);

  // À CHAQUE RECHARGEMENT on bloque l’appli après définition d’un PIN
  useEffect(() => {
    if (hasPin) {
      lock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPin]);

  if (pinState === "setup") {
    return <PINSetup onSuccess={() => setPinState("open")} />;
  }
  if (pinState === "unlock") {
    return <PINUnlock onSuccess={() => setPinState("open")} />;
  }

  // L’application principale :
  return <AppContent />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ProtectedApp />
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
