
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
    <div className="container mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-secondary/80"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gradient">Paramètres</h1>
      </div>

      <Card className="border border-border/50 shadow-lg overflow-hidden">
        <CardHeader className="bg-secondary/20 pb-4">
          <CardTitle className="text-xl font-semibold">Affichage</CardTitle>
          <CardDescription className="text-muted-foreground">
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-secondary/20 transition-colors">
            <div>
              <h3 className="font-medium text-base">Couleurs inversées</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Inverser les couleurs de l'interface pour un meilleur contraste
              </p>
            </div>
            <Switch 
              checked={invertColors} 
              onCheckedChange={toggleInvertColors} 
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-secondary/20 transition-colors">
            <div>
              <h3 className="font-medium text-base">Notifications toast</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Afficher les notifications temporaires dans l'application
              </p>
            </div>
            <Switch 
              checked={showToasts} 
              onCheckedChange={toggleShowToasts}
              className="data-[state=checked]:bg-primary" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
