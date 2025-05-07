
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDashboardTitle } from "@/hooks/useDashboardTitle";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { EditDashboardDialog } from "./EditDashboardDialog";
import { DashboardDropdown } from "./DashboardDropdown";
import { DashboardActions } from "./DashboardActions";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  const { budgets, totalRevenues, totalExpenses } = useBudgets();
  const { currentDashboardId } = useDashboardContext();
  const { dashboardTitle, isLoading, dashboards, updateDashboardTitle } = useDashboardTitle();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateDashboard = async (newTitle: string) => {
    await updateDashboardTitle(newTitle);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-2 border-b">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBackClick}
          className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 flex-grow justify-between">
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              {dashboardTitle || "Tableau de bord"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Synthèse {dashboardTitle || ""} - Vue d'ensemble de vos finances
            </p>
          </div>
          
          <DashboardDropdown
            title={dashboardTitle}
            isLoading={isLoading}
            dashboards={dashboards}
            currentDashboardId={currentDashboardId}
            onEditClick={() => setIsEditDialogOpen(true)}
            showEditOption={false}
          />
        </div>
      </div>
      
      <DashboardActions
        totalRevenues={totalRevenues}
        totalExpenses={totalExpenses}
        budgets={budgets}
      />

      <EditDashboardDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentName={dashboardTitle}
        onSave={handleUpdateDashboard}
      />
    </div>
  );
};
