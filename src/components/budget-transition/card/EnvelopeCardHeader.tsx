
import { BudgetEnvelope } from "@/types/transition";
import { formatAmount } from "@/utils/format-amount";
import { useTheme } from "@/context/ThemeContext";

export const EnvelopeCardHeader = ({
  envelope,
  currency = "EUR",
}: {
  envelope: BudgetEnvelope;
  currency?: "EUR" | "USD" | "GBP";
}) => {
  const { t } = useTheme();

  return (
    <div>
      <div className="font-bold text-lg">{envelope.title}</div>
      <div className="text-sm text-gray-600">
        {t("transition.remaining")}: {formatAmount(envelope.remaining, currency)}
      </div>
    </div>
  );
};
