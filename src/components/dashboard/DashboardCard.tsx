
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Pencil, Trash2 } from "lucide-react";
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              {title}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id, title);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
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
