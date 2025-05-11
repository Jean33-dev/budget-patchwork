
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Database } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatabaseRepair } from "@/hooks/useDatabaseRepair";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const navigate = useNavigate();
  const { invertColors, toggleInvertColors, showToasts, toggleShowToasts } = useTheme();
  const { 
    repairDatabase, 
    resetDatabase, 
    isRepairing, 
    repairSuccess, 
    resetSuccess
  } = useDatabaseRepair();

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

      <Card>
        <CardHeader>
          <CardTitle>Base de données</CardTitle>
          <CardDescription>
            Options de maintenance et de réparation de la base de données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {repairSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertTitle>Réparation terminée</AlertTitle>
              <AlertDescription>
                La base de données a été réparée avec succès.
              </AlertDescription>
            </Alert>
          )}

          {resetSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertTitle>Réinitialisation terminée</AlertTitle>
              <AlertDescription>
                La base de données a été réinitialisée avec succès.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Réparation de la base de données</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Tente de réparer la base de données en cas de problème de corruption sans perdre vos données
              </p>
              <Button 
                onClick={repairDatabase} 
                disabled={isRepairing}
                variant="outline"
              >
                {isRepairing ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Réparation en cours...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Réparer la base de données
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium text-destructive">Réinitialiser la base de données</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Efface toutes les données et réinitialise la base de données. Cette action est irréversible.
              </p>
              <Button 
                onClick={resetDatabase} 
                variant="destructive"
                disabled={isRepairing}
              >
                Réinitialiser la base de données
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
