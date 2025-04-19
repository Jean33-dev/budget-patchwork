
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit } from "lucide-react";
import { db } from "@/services/database";

interface DashboardSummaryProps {
  dashboardId: string;
}

export function DashboardSummary({ dashboardId }: DashboardSummaryProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [stats, setStats] = useState({
    budgetCount: 0,
    expenseCount: 0,
    incomeCount: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        if (dashboardId === "default") {
          // Try to get first dashboard or create one
          const dashboards = await db.getDashboards();
          if (dashboards && dashboards.length > 0) {
            setDashboard(dashboards[0]);
            loadStats(dashboards[0].id);
          } else {
            // No dashboards yet
            setDashboard(null);
          }
        } else {
          // For specific dashboard, find it in the list of dashboards
          const dashboards = await db.getDashboards();
          const dashboardData = dashboards.find(d => d.id === dashboardId);
          setDashboard(dashboardData || null);
          if (dashboardData) {
            loadStats(dashboardId);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadStats = async (id: string) => {
      try {
        // Get all items and filter by dashboard ID
        const allBudgets = await db.getBudgets();
        const allExpenses = await db.getExpenses();
        const allIncomes = await db.getIncomes();
        
        // Filter items for the current dashboard
        const budgets = allBudgets.filter(b => b.dashboardId === id);
        const expenses = allExpenses.filter(e => e.dashboardId === id);
        const incomes = allIncomes.filter(i => i.dashboardId === id);
        
        setStats({
          budgetCount: budgets.length,
          expenseCount: expenses.length,
          incomeCount: incomes.length
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadDashboardData();
  }, [dashboardId]);

  if (isLoading) {
    return <DashboardSummarySkeleton />;
  }

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h3 className="text-xl font-medium mb-2">Aucun tableau de bord</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier tableau de bord pour commencer à gérer votre budget.
            </p>
            <Button onClick={() => navigate("/")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer un tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{dashboard.title}</span>
          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/${dashboard.id}`)}>
            <FileEdit className="mr-2 h-4 w-4" />
            Gérer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Budgets"
            value={stats.budgetCount}
            action={() => navigate(`/dashboard/${dashboard.id}/budgets`)}
          />
          <StatCard
            title="Dépenses"
            value={stats.expenseCount}
            action={() => navigate(`/dashboard/${dashboard.id}/expenses`)}
          />
          <StatCard
            title="Revenus"
            value={stats.incomeCount}
            action={() => navigate(`/dashboard/${dashboard.id}/incomes`)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, action }: { title: string; value: number; action: () => void }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={action}>
        Voir tous
      </Button>
    </div>
  );
}

function DashboardSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-9 w-full mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
