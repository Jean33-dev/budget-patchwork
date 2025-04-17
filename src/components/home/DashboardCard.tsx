
import { LineChart, Settings, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/services/database/models/dashboard";

interface DashboardCardProps {
  dashboard: Dashboard;
  onEdit: (dashboard: Dashboard, e: React.MouseEvent) => void;
  onDelete: (dashboard: Dashboard, e: React.MouseEvent) => void;
  onClick: (dashboard: Dashboard) => void;
  canDelete: boolean;
}

export const DashboardCard = ({
  dashboard,
  onEdit,
  onDelete,
  onClick,
  canDelete,
}: DashboardCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(dashboard)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6" />
            {dashboard.title}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => onEdit(dashboard, e)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => onDelete(dashboard, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Créé le {new Date(dashboard.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
