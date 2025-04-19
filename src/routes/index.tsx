
import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/components/home/HomePage";
import BudgetsPage from "@/components/budget/BudgetsPage";
import ExpensesPage from "@/components/expense/ExpensesPage";
import IncomesPage from "@/components/income/IncomesPage";
import RecurringsPage from "@/components/recurring/RecurringsPage";
import { SystemDiagnosticsPage } from "@/components/system/SystemDiagnosticsPage";
import { Navigate } from "react-router-dom";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/:dashboardId" element={<HomePage />} />
      <Route path="/dashboard/:dashboardId/budgets" element={<BudgetsPage />} />
      <Route path="/dashboard/:dashboardId/expenses" element={<ExpensesPage />} />
      <Route path="/dashboard/:dashboardId/incomes" element={<IncomesPage />} />
      <Route path="/dashboard/:dashboardId/recurrings" element={<RecurringsPage />} />
      <Route path="/diagnostics" element={<SystemDiagnosticsPage />} />
      
      {/* Add a redirect for database issues */}
      <Route path="/database-error" element={<Navigate to="/diagnostics" />} />
      
      {/* Add a fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
