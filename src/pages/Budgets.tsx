
import BudgetsPage from "@/components/budget/BudgetsPage";
import { useTheme } from "@/context/ThemeContext";

// Affichage du titre traduit, mais la page réelle est BudgetsPage (à traduire à l'intérieur)
const Budgets = () => {
  const { t } = useTheme();
  // Le titre principal sera géré par BudgetsHeader et les autres composants enfants
  return <BudgetsPage />;
};

export default Budgets;
