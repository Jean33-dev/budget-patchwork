
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/utils/format-amount";
import { Trash2 } from "lucide-react";
import { Expense } from "@/services/database/models/expense";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

interface RecurringExpenseCardProps {
  expense: Expense;
  budgetName: string;
  onDelete: () => void;
  onEdit: () => void;
  currentDate: string;
  currency?: "EUR" | "USD" | "GBP";
}

export const RecurringExpenseCard = ({
  expense,
  budgetName,
  onDelete,
  onEdit,
  currentDate,
  currency,
}: RecurringExpenseCardProps) => {
  const { currency: globalCurrency, t } = useTheme();
  const usedCurrency = currency || globalCurrency;

  // Format the date nicely for display
  const formattedDate = expense.date ? 
    format(new Date(expense.date), "MMMM yyyy", { locale: fr }) : 
    t("recurring.unknownDate");

  // Pour empêcher l'ouverture du dialog lors d'un clic sur le bouton de suppression
  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onEdit();
  };

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border-t-4 border-t-red-500 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={t("recurring.editExpenseLabel", { title: expense.title })}
      role="button"
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
    >
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg font-medium line-clamp-2" title={expense.title}>
          {expense.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">{t("recurring.amount")}:</span>
            <span className="font-medium text-red-600">{formatAmount(expense.budget, usedCurrency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">{t("recurring.linkedBudget")}:</span>
            <span className="font-medium">{budgetName || t("recurring.noBudget")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">{t("recurring.date")}:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 justify-end pt-3 pb-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:bg-red-50 hover:text-red-600" 
          onClick={e => {
            e.stopPropagation(); // Pour ne pas déclencher onEdit
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t("recurring.delete")}
        </Button>
      </CardFooter>
    </Card>
  );
};
