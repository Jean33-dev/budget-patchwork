
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateDashboardDialog } from "./CreateDashboardDialog";
import { DashboardGrid } from "./DashboardGrid";
import { DashboardSummary } from "./DashboardSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboards } from "@/hooks/useDashboards";
import { useBudgetInitialization } from "@/hooks/useBudgetInitialization";
import { AlertTriangle, Database } from "lucide-react";

export const HomePage = () => {
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  
  const {
    dashboards,
    isLoading,
    error,
    retryLoadDashboards,
    loadAttempts,
    MAX_LOAD_ATTEMPTS,
    addDashboard,
    updateDashboard,
    deleteDashboard
  } = useDashboards();

  const { initializationSuccess } = useBudgetInitialization();
  
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDashboard, setEditDashboard] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDashboardId, setDeleteDashboardId] = useState(null);

  // Redirect to the selected dashboard if dashboardId changes or on component mount
  useEffect(() => {
    if (!isLoading && dashboards.length > 0) {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (!dashboard && dashboardId !== "default") {
        navigate("/");
      }
    }
  }, [dashboardId, dashboards, isLoading, navigate]);

  const handleDashboardClick = (dashboard) => {
    navigate(`/dashboard/${dashboard.id}`);
  };

  const handleEditDashboard = (dashboard, e) => {
    e.stopPropagation();
    setEditDashboard(dashboard);
    setEditDialogOpen(true);
  };

  const handleDeleteDashboard = (dashboard, e) => {
    e.stopPropagation();
    setDeleteDashboardId(dashboard.id);
    setDeleteDialogOpen(true);
  };

  const handleCreateDashboard = async (name) => {
    const id = await addDashboard(name);
    if (id) {
      navigate(`/dashboard/${id}`);
    }
    setCreateDialogOpen(false);
  };

  const hasInitializationError = initializationSuccess === false || error || loadAttempts >= MAX_LOAD_ATTEMPTS;

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="all">Tous les tableaux</TabsTrigger>
          </TabsList>
          
          {hasInitializationError && (
            <Link to="/diagnostics">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5 text-amber-500" />
                <span>Diagnostics</span>
              </Button>
            </Link>
          )}
        </div>

        {hasInitializationError && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Problème de chargement détecté</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Des problèmes avec la base de données ont été détectés. 
                  <Link to="/diagnostics" className="underline ml-1">
                    Voir les diagnostics
                  </Link> pour résoudre ce problème.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="dashboard">
          <DashboardSummary dashboardId={dashboardId} />
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Mes tableaux de bord</CardTitle>
              <CardDescription>
                Gérez vos différents tableaux de bord budgétaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <DashboardGrid
                  isLoading={isLoading}
                  dashboards={dashboards}
                  onEdit={handleEditDashboard}
                  onDelete={handleDeleteDashboard}
                  onClick={handleDashboardClick}
                  onCreateClick={() => setCreateDialogOpen(true)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateDashboardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onConfirm={handleCreateDashboard}
      />
    </div>
  );
};
