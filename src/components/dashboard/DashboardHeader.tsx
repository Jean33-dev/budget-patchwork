
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarPlus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { db } from "@/services/database";
import { BudgetPDFDownload } from "@/components/pdf/BudgetPDF";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { EditDashboardDialog } from "./EditDashboardDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dashboard } from "@/services/database/models/dashboard";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { budgets, totalRevenues, totalExpenses } = useBudgets();
  const { currentDashboardId } = useDashboardContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  
  // Ref to track if dashboard creation is in progress to prevent race conditions
  const isCreatingDashboardRef = useRef(false);
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      // Mark component as unmounted on cleanup
      isMountedRef.current = false;
    };
  }, []);

  const loadDashboards = async () => {
    try {
      await db.init();
      console.log("DashboardHeader: Chargement de tous les tableaux de bord...");
      const allDashboards = await db.getDashboards();
      console.log("DashboardHeader: Tableaux de bord chargés:", allDashboards);
      
      if (isMountedRef.current) {
        setDashboards(allDashboards);
      }
      
      return allDashboards;
    } catch (error) {
      console.error("DashboardHeader: Erreur lors du chargement des tableaux de bord:", error);
      return [];
    }
  };

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
    
    // Clean up function
    return () => {
      // Already handled by the mounted ref
    };
  }, [currentDashboardId]);

  const handleUpdateDashboard = async (newTitle: string) => {
    try {
      if (!currentDashboardId) return;
      
      console.log("DashboardHeader: Mise à jour du tableau de bord avec ID:", currentDashboardId);
      console.log("DashboardHeader: Nouveau titre:", newTitle);
      
      const dashboard = await db.getDashboardById(currentDashboardId);
      
      if (dashboard) {
        await db.updateDashboard({
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        
        setDashboardTitle(newTitle);
        console.log("DashboardHeader: Titre mis à jour avec succès:", newTitle);
        
        // Recharger la liste des tableaux de bord après modification
        await loadDashboards();
      } else {
        console.log("DashboardHeader: Tableau de bord non trouvé pour la mise à jour, vérification si création en cours...");
        
        // Only create if not already in progress
        if (!isCreatingDashboardRef.current) {
          isCreatingDashboardRef.current = true;
          try {
            console.log("DashboardHeader: Création d'un nouveau tableau de bord avec ID:", currentDashboardId);
            
            const now = new Date().toISOString();
            await db.addDashboard({
              id: currentDashboardId,
              title: newTitle,
              createdAt: now,
              updatedAt: now
            });
            
            setDashboardTitle(newTitle);
            
            // Recharger la liste des tableaux de bord après création
            await loadDashboards();
          } finally {
            isCreatingDashboardRef.current = false;
          }
        }
      }
    } catch (error) {
      console.error("DashboardHeader: Erreur lors de la mise à jour du titre:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du titre"
      });
    }
  };

  const switchToDashboard = (dashboardId: string) => {
    navigate(`/dashboard/${dashboardId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBackClick}
          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 flex-grow">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <span className="text-xl font-normal">
                  {isLoading ? "Chargement..." : `Tableau de bord ${dashboardTitle}`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {dashboards.map(dashboard => (
                <DropdownMenuItem
                  key={dashboard.id}
                  onClick={() => switchToDashboard(dashboard.id)}
                  className={currentDashboardId === dashboard.id ? "bg-accent" : ""}
                >
                  {dashboard.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Modifier le titre
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mb-4">
        <BudgetPDFDownload
          fileName="rapport-budget.pdf"
          totalIncome={totalRevenues}
          totalExpenses={totalExpenses}
          budgets={budgets}
          className="flex items-center gap-2"
        />
        
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard/budget/transition")}
          className="flex items-center gap-2"
        >
          <CalendarPlus className="h-4 w-4" />
          Nouveau mois
        </Button>
      </div>

      <EditDashboardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={dashboardTitle}
        onSave={handleUpdateDashboard}
      />
    </div>
  );
};
