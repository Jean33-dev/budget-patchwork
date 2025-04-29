
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

interface DashboardCardProps {
  id: string;
  title: string;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const DashboardCard = ({ id, title, onEdit, onDelete }: DashboardCardProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
                Renommer
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
                Supprimer
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le tableau de bord sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(id);
                setShowDeleteDialog(false);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
