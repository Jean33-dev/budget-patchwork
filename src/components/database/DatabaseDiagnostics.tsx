
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, Database, CheckCircle } from "lucide-react";
import { db } from "@/services/database";
import { toast } from "@/hooks/use-toast";
import { useBudgetInitialization } from "@/hooks/useBudgetInitialization";

export const DatabaseDiagnostics = () => {
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [lastError, setLastError] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});
  
  const {
    isRefreshing,
    initializationSuccess,
    handleManualRefresh,
    clearCacheAndRefresh
  } = useBudgetInitialization();

  const testDatabase = async () => {
    setIsTestingDb(true);
    setLastError(null);
    
    try {
      // Reset initialization attempts
      db.resetInitializationAttempts?.();
      
      // Test database initialization
      console.log("Testing database initialization...");
      const initialized = await db.init();
      
      if (!initialized) {
        throw new Error("La base de données n'a pas pu être initialisée");
      }
      
      // Try to get dashboards to test if data can be retrieved
      console.log("Testing data retrieval...");
      const dashboards = await db.getDashboards();
      console.log("Retrieved dashboards:", dashboards);
      
      // Update diagnostic info
      setDiagnosticInfo({
        dashboardCount: dashboards.length,
        initialized: initialized,
        timestamp: new Date().toISOString()
      });
      
      // Update status
      setDbStatus("ok");
      
      toast({
        title: "Test réussi",
        description: "La base de données fonctionne correctement."
      });
    } catch (error) {
      console.error("Database test failed:", error);
      setDbStatus("error");
      setLastError(error instanceof Error ? error.message : String(error));
      
      toast({
        variant: "destructive",
        title: "Échec du test",
        description: "La base de données ne fonctionne pas correctement."
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  // Run a test on mount
  useEffect(() => {
    const runInitialTest = async () => {
      await testDatabase();
    };
    
    runInitialTest();
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Diagnostic de la base de données
          <Badge variant={dbStatus === "ok" ? "outline" : "destructive"}>
            {dbStatus === "ok" ? "OK" : dbStatus === "error" ? "Erreur" : "Non testé"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dbStatus === "error" && lastError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de base de données</AlertTitle>
            <AlertDescription className="mt-2">
              {lastError}
              
              <div className="mt-4">
                <p className="text-sm mb-2">Informations de diagnostic:</p>
                <pre className="text-xs bg-destructive/10 p-2 rounded">
                  {JSON.stringify(diagnosticInfo, null, 2)}
                </pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {dbStatus === "ok" && (
          <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-300">Base de données fonctionnelle</AlertTitle>
            <AlertDescription className="mt-2 text-green-600 dark:text-green-400">
              La base de données a été initialisée avec succès.
              
              {diagnosticInfo.dashboardCount !== undefined && (
                <p className="mt-1">
                  {diagnosticInfo.dashboardCount} tableau(x) de bord trouvé(s).
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testDatabase}
            disabled={isTestingDb}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isTestingDb ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Tester la base de données
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleManualRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir la base de données
          </Button>
          
          <Button 
            onClick={clearCacheAndRefresh} 
            disabled={isRefreshing} 
            variant="destructive"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Vider le cache et réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
