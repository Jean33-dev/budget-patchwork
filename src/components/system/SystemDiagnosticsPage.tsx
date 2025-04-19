
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseDiagnostics } from "@/components/database/DatabaseDiagnostics";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const SystemDiagnosticsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("database");
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Diagnostics système</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Rafraîchir
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Outils de diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ces outils vous aident à identifier et résoudre les problèmes liés à l'application.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                Si l'application présente des problèmes de chargement des données, commencez par tester la base de données et éventuellement vider le cache.
              </p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="database">Base de données</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database">
              <DatabaseDiagnostics />
            </TabsContent>
            
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>Informations système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Navigateur:</div>
                      <div className="text-sm">{navigator.userAgent}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Plateforme:</div>
                      <div className="text-sm">{navigator.platform}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Langue:</div>
                      <div className="text-sm">{navigator.language}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">En ligne:</div>
                      <div className="text-sm">{navigator.onLine ? "Oui" : "Non"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Cookies activés:</div>
                      <div className="text-sm">{navigator.cookieEnabled ? "Oui" : "Non"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Logs du système
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => console.clear()}
                      className="text-xs"
                    >
                      Effacer les logs
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Pour voir les logs, ouvrez la console développeur de votre navigateur (F12 ou Ctrl+Shift+I).
                  </p>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => console.log("Test log - " + new Date().toISOString())}
                    className="w-full mb-2"
                  >
                    Générer un log de test
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      try {
                        // @ts-ignore - Générer une erreur délibérément
                        const obj = null;
                        obj.nonExistentProperty = true;
                      } catch (e) {
                        console.error("Erreur de test:", e);
                      }
                    }}
                    className="w-full"
                  >
                    Générer une erreur de test
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Si les problèmes persistent, essayez de vider le cache du navigateur ou de 
          <Link to="/" className="text-primary mx-1">revenir à l'accueil</Link>
          et réessayer.
        </p>
      </div>
    </div>
  );
};

export default SystemDiagnosticsPage;
