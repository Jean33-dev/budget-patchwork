
import { useParams, useNavigate } from "react-router-dom";
import Home from "@/pages/Home";
import { DashboardTabs } from "@/components/home/DashboardTabs";
import { DashboardSummary } from "@/components/home/DashboardSummary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { db } from "@/services/database";
import { Link } from "react-router-dom";

export function HomePage() {
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();
  const [dbInitFailed, setDbInitFailed] = useState(false);
  const [isCheckingDb, setIsCheckingDb] = useState(true);
  const navigate = useNavigate();
  const dbCheckAttemptRef = useRef(false);

  // Vérifier l'état de la base de données au chargement de la page
  useEffect(() => {
    // Only attempt database check once
    if (dbCheckAttemptRef.current) return;
    dbCheckAttemptRef.current = true;
    
    let checkDbTimeout: number;
    
    const checkDatabaseStatus = async () => {
      setIsCheckingDb(true);
      try {
        console.log("HomePage: Checking database status...");
        
        // Réinitialiser les tentatives
        db.resetInitializationAttempts?.();
        
        // Tenter d'initialiser la base de données
        const result = await Promise.race([
          db.init(),
          new Promise<boolean>(resolve => setTimeout(() => resolve(false), 8000))
        ]);
        
        console.log("HomePage: Database initialization result:", result);
        setDbInitFailed(!result);
        
        // Si l'initialisation a échoué, rafraîchir l'état après un délai
        if (!result) {
          console.log("HomePage: Database initialization failed, will retry once after 5 seconds");
          checkDbTimeout = window.setTimeout(() => {
            checkDatabaseStatus();
          }, 5000); // Réessayer après 5 secondes
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la base de données:", error);
        setDbInitFailed(true);
      } finally {
        setIsCheckingDb(false);
      }
    };
    
    checkDatabaseStatus();
    
    return () => {
      if (checkDbTimeout) {
        window.clearTimeout(checkDbTimeout);
      }
    };
  }, []);

  // Forcer une réinitialisation complète de la base de données
  const handleForceReload = () => {
    window.location.reload();
  };

  // Si nous sommes sur la page d'accueil principale (pas un tableau de bord spécifique)
  if (dashboardId === "default") {
    return (
      <>
        {dbInitFailed && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problème de base de données</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                La base de données n'a pas pu être initialisée correctement.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleForceReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Rafraîchir la page
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link to="/diagnostics">
                    <Database className="h-4 w-4" />
                    Diagnostics système
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        {isCheckingDb ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Vérification de la base de données...</p>
          </div>
        ) : (
          <Home />
        )}
      </>
    );
  }

  // If we're checking the database, show a loading indicator
  if (isCheckingDb) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Vérification de la base de données...</p>
        </div>
      </div>
    );
  }

  // Si nous sommes sur un tableau de bord spécifique
  return (
    <div className="container mx-auto py-6 space-y-6">
      {dbInitFailed && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problème de base de données</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              La base de données n'a pas pu être initialisée correctement.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleForceReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Rafraîchir la page
              </Button>
              <Button
                variant="outline"
                asChild
                className="flex items-center gap-2"
              >
                <Link to="/diagnostics">
                  <Database className="h-4 w-4" />
                  Diagnostics système
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <DashboardSummary dashboardId={dashboardId} />
      <DashboardTabs dashboardId={dashboardId} />
    </div>
  );
}
