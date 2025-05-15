
import React from "react";
import { Button } from "@/components/ui/button";
import { FileExport, FileImport } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

interface ExportImportButtonsProps {
  className?: string;
}

export const ExportImportButtons = ({ className = "" }: ExportImportButtonsProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const data = db.exportData();
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucune donnée à exporter"
        });
        return;
      }
      
      // Convertir les données en base64
      const base64Data = btoa(
        new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Créer un objet de données à exporter
      const exportObject = {
        format: "lovable-budget-data",
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: base64Data
      };
      
      // Convertir en JSON
      const jsonData = JSON.stringify(exportObject);
      
      // Créer un Blob et un URL pour le téléchargement
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement invisible
      const link = document.createElement("a");
      link.href = url;
      link.download = `budget-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportation réussie",
        description: "Vos données ont été exportées avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation des données"
      });
    }
  };

  const handleImport = () => {
    try {
      // Créer un input file invisible
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (!file) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Aucun fichier sélectionné"
          });
          return;
        }
        
        // Lire le fichier
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string;
            const importObject = JSON.parse(content);
            
            // Vérifier le format
            if (importObject.format !== "lovable-budget-data") {
              toast({
                variant: "destructive",
                title: "Format invalide",
                description: "Le fichier n'est pas au format attendu"
              });
              return;
            }
            
            // Convertir les données base64 en Uint8Array
            const base64Data = importObject.data;
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Importer les données
            const success = db.importData(bytes);
            
            if (success) {
              toast({
                title: "Importation réussie",
                description: "Les données ont été importées avec succès. Veuillez rafraîchir la page."
              });
              
              // Recharger la page après un court délai
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              toast({
                variant: "destructive",
                title: "Erreur d'importation",
                description: "Une erreur est survenue lors de l'importation des données"
              });
            }
          } catch (error) {
            console.error("Erreur lors de la lecture du fichier:", error);
            toast({
              variant: "destructive",
              title: "Erreur de lecture",
              description: "Impossible de lire le fichier d'importation"
            });
          }
        };
        
        reader.readAsText(file);
      };
      
      // Déclencher le sélecteur de fichier
      input.click();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: "Une erreur est survenue lors de l'importation des données"
      });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="flex items-center gap-1"
        title="Exporter les données"
      >
        <FileExport className="h-4 w-4" />
        <span className="hidden sm:inline">Exporter</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleImport}
        className="flex items-center gap-1"
        title="Importer des données"
      >
        <FileImport className="h-4 w-4" />
        <span className="hidden sm:inline">Importer</span>
      </Button>
    </div>
  );
};
