
import { Home, Clock, CreditCard, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          <li>
            <Link 
              to="/dashboard/budget" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <Home className="h-6 w-6" />
              <span className="text-xs">Accueil</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/budgets" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <Clock className="h-6 w-6" />
              <span className="text-xs">Budgets</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/expenses" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-xs">Dépenses</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/income" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <DollarSign className="h-6 w-6" />
              <span className="text-xs">Revenus</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/budget/categories" 
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-xs">Catégories</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
