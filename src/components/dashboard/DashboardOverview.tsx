
import { useState } from "react";
import { useChartData, ChartType } from "@/hooks/useChartData";
import { OverviewStats } from "./OverviewStats";
import { ChartSection } from "./ChartSection";
import { useTheme } from "@/context/ThemeContext";

interface DashboardOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  envelopes: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
    category?: string;
  }>;
  currency?: "EUR" | "USD" | "GBP";
}

export const DashboardOverview = ({ totalIncome, totalExpenses, envelopes, currency }: DashboardOverviewProps) => {
  const [chartType, setChartType] = useState<ChartType>("budget");
  const balance = totalIncome - totalExpenses;
  const { getChartData, getChartTitle } = useChartData(envelopes, totalIncome);
  const { currency: globalCurrency } = useTheme();
  const usedCurrency = currency || globalCurrency;

  const chartData = getChartData(chartType);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <OverviewStats
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
            currency={usedCurrency}
          />
        </div>
        <div className="md:col-span-2">
          <ChartSection
            chartType={chartType}
            onChartTypeChange={setChartType}
            title={getChartTitle(chartType)}
            data={chartData.data}
            totalIncome={chartData.total}
            addUnallocated={chartData.addUnallocated}
            currency={usedCurrency}
          />
        </div>
      </div>
    </div>
  );
};
