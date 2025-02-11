
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChartPie, ChartBar, ListTree } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
  category?: "necessaire" | "plaisir" | "epargne";
}

interface BudgetChartProps {
  data: BudgetData[];
  totalIncome?: number;
}

const COLORS = {
  income: ["#10B981", "#34D399", "#6EE7B7"],
  expense: ["#EF4444", "#F87171", "#FCA5A5"],
  budget: [
    "#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#F2FCE2", 
    "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#FDE1D3",
  ],
  category: {
    necessaire: "#0EA5E9",
    plaisir: "#F97316",
    epargne: "#10B981"
  }
};

export const BudgetChart = ({ data, totalIncome = 0 }: BudgetChartProps) => {
  const [chartType, setChartType] = useState<"pie" | "bar" | "category">("pie");
  
  // Calculer le total des budgets alloués
  const totalAllocated = data.reduce((sum, item) => sum + item.value, 0);
  
  // Ajouter le budget non alloué aux données
  const remainingBudget = totalIncome - totalAllocated;
  const chartData = [
    ...data,
    {
      name: "Budget non alloué",
      value: remainingBudget > 0 ? remainingBudget : 0,
      type: "budget" as const,
    },
  ];

  // Données pour le graphique par catégorie
  const categoryData = [
    {
      name: "Nécessaire",
      value: data.filter(item => item.category === "necessaire").reduce((sum, item) => sum + item.value, 0),
      type: "budget" as const,
      category: "necessaire" as const
    },
    {
      name: "Plaisir",
      value: data.filter(item => item.category === "plaisir").reduce((sum, item) => sum + item.value, 0),
      type: "budget" as const,
      category: "plaisir" as const
    },
    {
      name: "Épargne",
      value: data.filter(item => item.category === "epargne").reduce((sum, item) => sum + item.value, 0),
      type: "budget" as const,
      category: "epargne" as const
    }
  ];

  // Calculer les pourcentages
  const getPercentage = (value: number) => {
    return ((value / totalIncome) * 100).toFixed(1);
  };

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[entry.type][index % COLORS[entry.type].length]}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string) => [
          `${value.toFixed(2)} € (${getPercentage(value)}%)`,
          name
        ]}
      />
      <Legend />
    </PieChart>
  );

  const renderBarChart = () => (
    <BarChart data={chartData} layout="vertical">
      <XAxis type="number" />
      <YAxis type="category" dataKey="name" width={150} />
      <Tooltip
        formatter={(value: number, name: string) => [
          `${value.toFixed(2)} € (${getPercentage(value)}%)`,
          name
        ]}
      />
      <Bar
        dataKey="value"
        fill="#8B5CF6"
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[entry.type][index % COLORS[entry.type].length]}
          />
        ))}
      </Bar>
    </BarChart>
  );

  const renderCategoryChart = () => (
    <PieChart>
      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {categoryData.map((entry) => (
          <Cell
            key={`cell-${entry.category}`}
            fill={COLORS.category[entry.category || "necessaire"]}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string) => [
          `${value.toFixed(2)} € (${getPercentage(value)}%)`,
          name
        ]}
      />
      <Legend />
    </PieChart>
  );

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return renderBarChart();
      case "category":
        return renderCategoryChart();
      default:
        return renderPieChart();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base sm:text-lg">Répartition des Budgets</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setChartType("pie")}>
              <ChartPie className="mr-2 h-4 w-4" />
              Graphique Circulaire
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setChartType("bar")}>
              <ChartBar className="mr-2 h-4 w-4" />
              Graphique en Barres
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setChartType("category")}>
              <ListTree className="mr-2 h-4 w-4" />
              Par Catégorie
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
