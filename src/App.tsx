
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Categories from "./pages/Categories";
import BudgetTransition from "./pages/BudgetTransition";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
            <Route path="/dashboard/:dashboardId/budgets" element={<Budgets />} />
            <Route path="/dashboard/:dashboardId/expenses" element={<Expenses />} />
            <Route path="/dashboard/:dashboardId/income" element={<Income />} />
            <Route path="/dashboard/:dashboardId/categories" element={<Categories />} />
            <Route path="/dashboard/:dashboardId/transition" element={<BudgetTransition />} />
            
            {/* Anciennes routes (redirection) */}
            <Route path="/dashboard/budget" element={<Navigate to="/" />} />
            <Route path="/dashboard/budget/budgets" element={<Navigate to="/" />} />
            <Route path="/dashboard/budget/expenses" element={<Navigate to="/" />} />
            <Route path="/dashboard/budget/income" element={<Navigate to="/" />} />
            <Route path="/dashboard/budget/categories" element={<Navigate to="/" />} />
            <Route path="/dashboard/budget/transition" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
