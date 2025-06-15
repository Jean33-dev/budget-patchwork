
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface CreateDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void>;
}

export const CreateDashboardDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreateDashboardDialogProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("dashboard.errorRequired") ?? "Le nom du tableau de bord est requis");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await onSave(name);
      setName("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.createDashboardTitle") ?? "Créer un nouveau tableau de bord"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-name">{t("dashboard.nameLabel") ?? "Nom du tableau de bord"}</Label>
            <Input
              id="dashboard-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("dashboard.namePlaceholder") ?? "Entrez le nom du tableau de bord"}
              autoFocus
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                setName("");
                setError(null);
              }}
              className="mr-2"
              disabled={isLoading}
            >
              {t("dashboard.cancel") ?? "Annuler"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (t("dashboard.creating") ?? "Création...") : (t("dashboard.create") ?? "Créer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

