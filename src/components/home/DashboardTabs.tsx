
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { db } from "@/services/database";

interface DashboardTabsProps {
  dashboardId: string;
}

export function DashboardTabs({ dashboardId }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("budgets");
  const [isLoading, setIsLoading] = useState(true);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const navigate = useNavigate();
  const initAttemptRef = useRef(false);

  // Check database initialization on mount
  useEffect(() => {
    // Only run this effect once
    if (initAttemptRef.current) return;
    initAttemptRef.current = true;
    
    const checkDbStatus = async () => {
      setIsLoading(true);
      try {
        console.log("DashboardTabs: Checking database status...");
        
        // Reset any previous initialization attempts to start fresh
        db.resetInitializationAttempts?.();
        
        // Try to initialize with timeout
        const initSuccess = await Promise.race([
          db.init(),
          new Promise<boolean>(resolve => setTimeout(() => resolve(false), 5000))
        ]);
        
        console.log("DashboardTabs: Database initialization result:", initSuccess);
        setIsDbInitialized(initSuccess);
      } catch (error) {
        console.error("Error checking database status:", error);
        setIsDbInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDbStatus();
  }, []);

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

  // Show loading state
  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Chargement des données...</p>
      </Card>
    );
  }

  // Show error state if database failed to initialize
  if (!isDbInitialized) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-destructive mb-2">Problème de chargement de la base de données</p>
          <button 
            className="text-sm underline" 
            onClick={() => navigate("/diagnostics")}
          >
            Voir les diagnostics système
          </button>
        </div>
      </Card>
    );
  }

  // Normal state with tabs
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
