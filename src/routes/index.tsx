
import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/components/home/HomePage";
import BudgetsPage from "@/components/budget/BudgetsPage";
import Expenses from "@/pages/Expenses";
import Income from "@/pages/Income";
import RecurringExpenses from "@/pages/RecurringExpenses";
import { SystemDiagnosticsPage } from "@/components/system/SystemDiagnosticsPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/:dashboardId" element={<HomePage />} />
      <Route path="/dashboard/:dashboardId/budgets" element={<BudgetsPage />} />
      <Route path="/dashboard/:dashboardId/expenses" element={<Expenses />} />
      <Route path="/dashboard/:dashboardId/incomes" element={<Income />} />
      <Route path="/dashboard/:dashboardId/recurrings" element={<RecurringExpenses />} />
      <Route path="/diagnostics" element={<SystemDiagnosticsPage />} />
    </Routes>
  );
};
