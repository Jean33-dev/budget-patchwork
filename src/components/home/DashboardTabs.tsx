
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface DashboardTabsProps {
  dashboardId: string;
}

export function DashboardTabs({ dashboardId }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("budgets");
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Navigate to the corresponding page based on tab selection
    switch (value) {
      case "budgets":
        navigate(`/dashboard/${dashboardId}/budgets`);
        break;
      case "expenses":
        navigate(`/dashboard/${dashboardId}/expenses`);
        break;
      case "incomes":
        navigate(`/dashboard/${dashboardId}/incomes`);
        break;
      case "recurrings":
        navigate(`/dashboard/${dashboardId}/recurrings`);
        break;
      default:
        break;
    }
  };

  return (
    <Card>
      <Tabs 
        defaultValue="budgets" 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="incomes">Revenus</TabsTrigger>
          <TabsTrigger value="recurrings">Récurrents</TabsTrigger>
        </TabsList>
        <TabsContent value="budgets" className="p-4">
          <h3 className="text-lg font-medium">Gestion des budgets</h3>
          <p className="text-muted-foreground">
            Gérez vos enveloppes budgétaires et suivez vos dépenses.
          </p>
        </TabsContent>
        <TabsContent value="expenses" className="p-4">
          <h3 className="text-lg font-medium">Dépenses</h3>
          <p className="text-muted-foreground">
            Suivez et gérez toutes vos dépenses.
          </p>
        </TabsContent>
        <TabsContent value="incomes" className="p-4">
          <h3 className="text-lg font-medium">Revenus</h3>
          <p className="text-muted-foreground">
            Suivez et gérez vos sources de revenus.
          </p>
        </TabsContent>
        <TabsContent value="recurrings" className="p-4">
          <h3 className="text-lg font-medium">Opérations récurrentes</h3>
          <p className="text-muted-foreground">
            Gérez vos dépenses et revenus récurrents.
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
