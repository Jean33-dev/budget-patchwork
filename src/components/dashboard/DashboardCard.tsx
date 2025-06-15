
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface DashboardCardProps {
  id: string;
  title: string;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const DashboardCard = ({ id, title, onEdit, onDelete }: DashboardCardProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { t } = useTheme();

  const handleClick = () => {
    localStorage.setItem('currentDashboardId', id);
    navigate(`/dashboard/${id}`);
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow" 
        onClick={handleClick}
      >
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              {title}
            </div>
            <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id, title);
                }}
              >
                {t("dashboard.rename")}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                {t("dashboard.delete")}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.confirmDeleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dashboard.cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(id);
                setShowDeleteDialog(false);
              }}
            >
              {t("dashboard.confirmDeleteAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
