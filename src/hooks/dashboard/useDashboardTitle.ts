
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { useDashboardLoading } from "./useDashboardLoading";
import { useDashboardOperations } from "./useDashboardOperations";
import { db } from "@/services/database";

export const useDashboardTitle = () => {
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();
  
  const {
    dashboardTitle,
    setDashboardTitle,
    isLoading,
    setIsLoading,
    dashboards,
    setDashboards,
    isCreatingDashboardRef,
    isMountedRef,
    loadDashboards
  } = useDashboardLoading(currentDashboardId);

  const { updateDashboardTitle } = useDashboardOperations(
    currentDashboardId,
    setDashboardTitle,
    loadDashboards,
    isCreatingDashboardRef,
    isMountedRef
  );

  const loadDashboardTitle = async () => {
    try {
      if (isCreatingDashboardRef.current) {
        console.log("DashboardHeader: Création de tableau de bord déjà en cours, attente...");
        return;
      }
      
      setIsLoading(true);
      
      // Ensure database is initialized
      await db.init();
      
      console.log("DashboardHeader: Chargement du dashboard avec ID:", currentDashboardId);
      
      if (!currentDashboardId) {
        console.log("DashboardHeader: Aucun ID de tableau de bord trouvé");
        if (isMountedRef.current) {
          setDashboardTitle("Sans titre");
          setIsLoading(false);
        }
        return;
      }
      
      // Load all dashboards first to check if current exists
      const allDashboards = await loadDashboards();
      
      // Check if dashboard exists in loaded dashboards
      const existingDashboard = allDashboards.find(d => d.id === currentDashboardId);
      
      if (existingDashboard) {
        console.log("DashboardHeader: Tableau de bord trouvé:", existingDashboard.title);
        if (isMountedRef.current) {
          setDashboardTitle(existingDashboard.title);
          setIsLoading(false);
        }
        return;
      }
      
      // If not found in cache, check directly from the database as a double-check
      console.log("DashboardHeader: Tableau de bord non trouvé dans le cache, vérification directe dans la BDD...");
      const dashboard = await db.getDashboardById(currentDashboardId);
      
      if (dashboard) {
        console.log("DashboardHeader: Tableau de bord trouvé dans la BDD:", dashboard.title);
        if (isMountedRef.current) {
          setDashboardTitle(dashboard.title);
          setDashboards(prevDashboards => [...prevDashboards, dashboard]);
        }
      } else {
        console.log("DashboardHeader: Tableau de bord non trouvé avec ID:", currentDashboardId);
        
        // Only create a new dashboard if one doesn't exist and we're not already creating one
        if (!isCreatingDashboardRef.current) {
          isCreatingDashboardRef.current = true;
          try {
            // Double-check again to prevent race conditions
            const verifyDashboard = await db.getDashboardById(currentDashboardId);
            
            if (!verifyDashboard) {
              // Utiliser un titre par défaut si le dashboard n'est pas trouvé
              const defaultTitle = "Sans titre";
              console.log("DashboardHeader: Création d'un nouveau tableau de bord avec ID:", currentDashboardId);
              
              // Créer un nouveau dashboard avec cet ID
              const newDashboard = {
                id: currentDashboardId,
                title: defaultTitle,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              await db.addDashboard(newDashboard);
              
              console.log("DashboardHeader: Nouveau tableau de bord créé:", newDashboard);
              
              if (isMountedRef.current) {
                setDashboardTitle(defaultTitle);
                setDashboards(prevDashboards => [...prevDashboards, newDashboard]);
                
                toast({
                  title: "Nouveau tableau de bord",
                  description: "Un nouveau tableau de bord a été créé"
                });
              }
            } else if (isMountedRef.current) {
              setDashboardTitle(verifyDashboard.title);
              setDashboards(prevDashboards => [...prevDashboards, verifyDashboard]);
            }
          } catch (error) {
            console.error("DashboardHeader: Erreur lors de la création du tableau de bord:", error);
            
            if (error instanceof Error) {
              // Specific handling for UNIQUE constraint error
              if (error.message.includes("UNIQUE constraint failed")) {
                console.log("DashboardHeader: Conflit de contrainte UNIQUE détecté, rechargement des tableaux de bord...");
                await loadDashboards();
                const dashboard = await db.getDashboardById(currentDashboardId);
                if (dashboard && isMountedRef.current) {
                  setDashboardTitle(dashboard.title);
                }
              } else {
                toast({
                  variant: "destructive",
                  title: "Erreur",
                  description: "Une erreur est survenue lors de la création du tableau de bord"
                });
              }
            }
          } finally {
            isCreatingDashboardRef.current = false;
          }
        }
      }
    } catch (error) {
      console.error("DashboardHeader: Erreur lors du chargement du titre:", error);
      if (isMountedRef.current) {
        setDashboardTitle("Sans titre");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du tableau de bord"
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDashboardTitle();
  }, [currentDashboardId]);

  return {
    dashboardTitle,
    isLoading,
    dashboards,
    updateDashboardTitle,
    loadDashboards,
  };
};
