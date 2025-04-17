
import { PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyDashboardCardProps {
  onClick: () => void;
}

export const EmptyDashboardCard = ({ onClick }: EmptyDashboardCardProps) => {
  return (
    <Card className="col-span-full bg-muted/40">
      <CardHeader>
        <CardTitle className="text-center">Aucun tableau de bord</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas encore de tableau de bord. Créez-en un pour commencer.
        </p>
        <Button onClick={onClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Créer un tableau de bord
        </Button>
      </CardContent>
    </Card>
  );
};
