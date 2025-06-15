
import { Wallet, WalletCards, CreditCard, HandCoins, ChartPie } from "lucide-react";
import { Link } from "react-router-dom";
import { AdBanner } from "@/components/shared/AdBanner";
import { useTheme } from "@/context/ThemeContext";

export const Footer = () => {
  const { t } = useTheme();
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-50 shadow-md">
      <AdBanner />
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          <li>
            <Link 
              to="/dashboard/budget" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <Wallet className="h-6 w-6" />
              <span className="text-xs">{t("footer.synthese")}</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/budgets" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <WalletCards className="h-6 w-6" />
              <span className="text-xs">{t("footer.budgets")}</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/expenses" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-xs">{t("footer.depenses")}</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/income" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <HandCoins className="h-6 w-6" />
              <span className="text-xs">{t("footer.revenus")}</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/categories" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <ChartPie className="h-6 w-6" />
              <span className="text-xs">{t("footer.categories")}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

