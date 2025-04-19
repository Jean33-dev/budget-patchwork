
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
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
          <div className="pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard/budget" element={<Dashboard />} />
              <Route path="/dashboard/budget/budgets" element={<Budgets />} />
              <Route path="/dashboard/budget/expenses" element={<Expenses />} />
              <Route path="/dashboard/budget/income" element={<Income />} />
              <Route path="/dashboard/budget/categories" element={<Categories />} />
              <Route path="/dashboard/budget/transition" element={<BudgetTransition />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
