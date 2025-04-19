
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  RefreshCw, 
  Database, 
  ArrowLeft, 
  CheckCircle,
  TrashIcon,
  RotateCw,
  HomeIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { toast } from "@/hooks/use-toast";
import { DatabaseDiagnostics } from "@/components/database/DatabaseDiagnostics";

// Add interface for Navigator with deviceMemory
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export function SystemDiagnosticsPage() {
  const [browserInfo, setBrowserInfo] = useState<Record<string, any>>({});
  const [isReloading, setIsReloading] = useState(false);
  
  // Récupérer les informations sur le navigateur
  useEffect(() => {
    const info: Record<string, any> = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
    };
    
    // Vérifier si nous sommes en PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      info.displayMode = 'standalone (PWA)';
    } else {
      info.displayMode = 'browser';
    }
    
    // Récupérer les informations sur la mémoire si disponible
    const navigatorWithMemory = navigator as NavigatorWithMemory;
    if (navigatorWithMemory.deviceMemory) {
      info.deviceMemory = `${navigatorWithMemory.deviceMemory}GB`;
    }
    
    // Vérifier si le mode privé est détectable
    const testPrivateMode = () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return false;
      } catch (e) {
        return true;
      }
    };
    
    info.privateMode = testPrivateMode() ? 'Possible' : 'Non détecté';
    
    setBrowserInfo(info);
  }, []);

  // Fonction pour rafraîchir la page
  const handleRefresh = () => {
    setIsReloading(true);
    window.location.reload();
  };
  
  // Fonction pour effacer le cache et les données
  const handleClearCacheAndData = async () => {
    try {
      setIsReloading(true);
      toast({
        title: "Suppression des données...",
        description: "Effacement du cache et des données en cours..."
      });
      
      // Effacer localStorage
      localStorage.clear();
      
      // Réinitialiser la base de données
      if (db.resetInitializationAttempts) {
        db.resetInitializationAttempts();
      }
      
      // Essayer de supprimer la base de données IndexedDB
      const clearIndexedDB = () => {
        return new Promise<void>((resolve, reject) => {
          try {
            const req = indexedDB.deleteDatabase('sqlitedb');
            req.onsuccess = () => resolve();
            req.onerror = () => reject(new Error("Erreur lors de la suppression d'IndexedDB"));
          } catch (e) {
            reject(e);
          }
        });
      };
      
      try {
        await clearIndexedDB();
        toast({
          title: "Données effacées",
          description: "Cache et données supprimés avec succès. Redémarrage de l'application..."
        });
      } catch (error) {
        console.error("Erreur lors de la suppression d'IndexedDB:", error);
        toast({
          variant: "destructive",
          title: "Échec partiel",
          description: "Certaines données n'ont pas pu être effacées. Redémarrage de l'application..."
        });
      }
      
      // Rafraîchir la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      console.error("Erreur lors de la suppression des données:", e);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des données"
      });
      setIsReloading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Diagnostics Système</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isReloading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
            {isReloading ? 'Redémarrage...' : 'Rafraîchir la page'}
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">Outil de diagnostic</AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          Cet outil permet de diagnostiquer et résoudre les problèmes de l'application.
          Utilisez-le si vous rencontrez des difficultés avec le chargement des données ou la base de données.
        </AlertDescription>
      </Alert>
      
      {/* Diagnostic de la base de données */}
      <DatabaseDiagnostics />
      
      {/* Informations sur le navigateur */}
      <Card>
        <CardHeader>
          <CardTitle>Informations système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(browserInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Actions avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Actions avancées</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Ces actions sont irréversibles et peuvent entraîner une perte de données.
              Utilisez-les uniquement en dernier recours.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-2">
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleClearCacheAndData}
              disabled={isReloading}
            >
              <TrashIcon className="h-4 w-4" />
              Effacer toutes les données et le cache
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              Cette action effacera toutes les données de l'application et rafraîchira la page.
              Utilisez-la si l'application ne fonctionne plus correctement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
