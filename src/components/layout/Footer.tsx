
import { Wallet, WalletCards, CreditCard, HandCoins, ChartPie } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: "/dashboard/budget", 
      icon: <Wallet className="h-5 w-5" />, 
      label: "Synthèse" 
    },
    { 
      path: "/dashboard/budget/budgets", 
      icon: <WalletCards className="h-5 w-5" />, 
      label: "Budgets" 
    },
    { 
      path: "/dashboard/budget/expenses", 
      icon: <CreditCard className="h-5 w-5" />, 
      label: "Dépenses" 
    },
    { 
      path: "/dashboard/budget/income", 
      icon: <HandCoins className="h-5 w-5" />, 
      label: "Revenus" 
    },
    { 
      path: "/dashboard/budget/categories", 
      icon: <ChartPie className="h-5 w-5" />, 
      label: "Catégories" 
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-2 px-4 z-50">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};
