
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Database, Trash, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatabaseRepair } from "@/hooks/useDatabaseRepair";

const Settings = () => {
  const navigate = useNavigate();
  const { invertColors, toggleInvertColors, darkMode, toggleDarkMode, showToasts, toggleShowToasts } = useTheme();
  const { isRepairing, repairDatabase, clearDatabaseCache } = useDatabaseRepair();

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
              <h3 className="font-medium flex items-center">
                Mode sombre
                {darkMode ? <Moon className="ml-2 h-4 w-4" /> : <Sun className="ml-2 h-4 w-4" />}
              </h3>
              <p className="text-sm text-muted-foreground">
                Activez un thème sombre dédié agréable et professionnel
              </p>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
              aria-label="Activer le mode sombre"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Couleurs inversées (expérimental)</h3>
              <p className="text-sm text-muted-foreground">
                Inverser toutes les couleurs (peut rendre l'interface imprévisible)
              </p>
            </div>
            <Switch 
              checked={invertColors && !darkMode} 
              onCheckedChange={toggleInvertColors}
              aria-label="Activer l'inversion des couleurs"
              disabled={darkMode}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Notifications</h3>
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

      <Card>
        <CardHeader>
          <CardTitle>Maintenance de la base de données</CardTitle>
          <CardDescription>
            Outils de réparation en cas de problème avec la base de données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Réinitialiser la connexion</h3>
              <p className="text-sm text-muted-foreground">
                Réinitialise la connexion à la base de données en cas de problème de communication
              </p>
              <Button 
                onClick={repairDatabase} 
                disabled={isRepairing}
                className="mt-2"
                variant="outline"
              >
                <Database className="mr-2 h-4 w-4" />
                {isRepairing ? "Réparation en cours..." : "Réparer la connexion"}
              </Button>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <h3 className="font-medium">Nettoyage avancé</h3>
              <p className="text-sm text-muted-foreground">
                Supprime le cache de la base de données et force une réinitialisation complète
              </p>
              <Button 
                onClick={clearDatabaseCache} 
                disabled={isRepairing}
                className="mt-2"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {isRepairing ? "Nettoyage en cours..." : "Nettoyer le cache"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Attention : Utilisez cette option uniquement en dernier recours. Les données ne seront pas perdues, mais l'application peut être temporairement indisponible pendant la réinitialisation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

