
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CreateDashboardCardProps {
  onClick: () => void;
}

export const CreateDashboardCard = ({ onClick }: CreateDashboardCardProps) => {
  return (
    <Card 
      className="border-dashed cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6" />
          Nouveau Tableau de Bord
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          Créer
        </Button>
      </CardContent>
    </Card>
  );
};
