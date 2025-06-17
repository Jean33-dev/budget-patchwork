
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface EditDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSave: (newName: string) => void;
}

export const EditDashboardDialog = ({
  open,
  onOpenChange,
  currentName,
  onSave,
}: EditDashboardDialogProps) => {
  const [name, setName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTheme();

  // Réinitialiser le nom et l'état de soumission quand le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setName(currentName);
      setIsSubmitting(false);
    }
  }, [open, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: t("dashboard.errorRequired"),
        description: t("dashboard.errorRequired")
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("EditDashboardDialog: Saving new dashboard name:", name);
      await onSave(name);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la modification du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le tableau de bord"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.rename")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.nameLabel")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-name">{t("dashboard.nameLabel")}</Label>
            <Input
              id="dashboard-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("dashboard.namePlaceholder")}
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("dashboard.cancel")}
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("dashboard.creating") : t("dashboard.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
