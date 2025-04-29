
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
          <DashboardDropdown
            title={dashboardTitle}
            isLoading={isLoading}
            dashboards={dashboards}
            currentDashboardId={currentDashboardId}
            onEditClick={() => setIsEditDialogOpen(true)}
            showEditOption={false} // Ne pas montrer l'option d'édition sur la page de synthèse
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
