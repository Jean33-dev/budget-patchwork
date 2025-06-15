
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "../shared/MoneyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";

interface EnvelopeFormProps {
  type: "income" | "expense" | "budget";
  title: string;
  setTitle: (title: string) => void;
  budget: number;
  setBudget: (budget: number) => void;
  linkedBudgetId: string;
  setLinkedBudgetId: (id: string) => void;
  date: string;
  setDate: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const EnvelopeForm = ({
  type,
  title,
  setTitle,
  budget,
  setBudget,
  linkedBudgetId,
  setLinkedBudgetId,
  date,
  setDate,
  onSubmit,
  availableBudgets = []
}: EnvelopeFormProps) => {
  const { t } = useTheme();
  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return t("envelopeForm.type.income");
      case "expense":
        return t("envelopeForm.type.expense");
      case "budget":
        return t("envelopeForm.type.budget");
      default:
        return "";
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("envelopeForm.titleLabel")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(`envelopeForm.titlePlaceholder`, { type: getTypeLabel(type) })}
          required
        />
      </div>

      {(type === "expense" || type === "income") && (
        <div className="space-y-2">
          <Label htmlFor="date">{t("envelopeForm.dateLabel")}</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      {type === "expense" && (
        <div className="space-y-2">
          <Label>{t("envelopeForm.linkedBudgetLabel")}</Label>
          <Select value={linkedBudgetId} onValueChange={setLinkedBudgetId} required>
            <SelectTrigger>
              <SelectValue placeholder={t("envelopeForm.linkedBudgetPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {availableBudgets.map((budget) => (
                <SelectItem key={budget.id} value={budget.id}>
                  {budget.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableBudgets.length === 0 && (
            <p className="text-sm text-red-500">
              {t("envelopeForm.noBudgets")}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="budget">{t("envelopeForm.amountLabel")}</Label>
        <MoneyInput
          id="budget"
          value={budget}
          onChange={setBudget}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">
          {t("envelopeForm.addButton", { type: getTypeLabel(type) })}
        </Button>
      </DialogFooter>
    </form>
  );
};
