
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  const navigate = useNavigate();
  const { invertColors, toggleInvertColors, showToasts, toggleShowToasts } = useTheme();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Affichage</CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Couleurs inversées</h3>
              <p className="text-sm text-muted-foreground">
                Inverser les couleurs de l'interface pour un meilleur contraste
              </p>
            </div>
            <Switch 
              checked={invertColors} 
              onCheckedChange={toggleInvertColors} 
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Notifications toast</h3>
              <p className="text-sm text-muted-foreground">
                Afficher les notifications temporaires dans l'application
              </p>
            </div>
            <Switch 
              checked={showToasts} 
              onCheckedChange={toggleShowToasts} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
