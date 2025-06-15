
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Database, Trash, Moon, Sun } from "lucide-react";
-import { useTheme } from "@/context/ThemeContext";
+import { useTheme, supportedLanguages } from "@/context/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatabaseRepair } from "@/hooks/useDatabaseRepair";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { usePinProtection } from "@/hooks/usePinProtection";

-// Mapping devise => symbole
-const currencyOptions = [
-  { value: "EUR", label: "Euro (€)", symbol: "€" },
-  { value: "USD", label: "Dollar ($)", symbol: "$" },
-  { value: "GBP", label: "Livre (£)", symbol: "£" },
-];
+// Mapping devise => symbole (ajoute la traduction dans le label via t)
+const currencyOptions = [
+  { value: "EUR", label: "Euro (€)", symbol: "€" },
+  { value: "USD", label: "Dollar ($)", symbol: "$" },
+  { value: "GBP", label: "Livre (£)", symbol: "£" },
+];

 const Settings = () => {
   const navigate = useNavigate();
-  const { invertColors, toggleInvertColors, darkMode, toggleDarkMode, showToasts, toggleShowToasts, currency, setCurrency } = useTheme();
+  const { invertColors, toggleInvertColors, darkMode, toggleDarkMode, showToasts, toggleShowToasts, currency, setCurrency, language, setLanguage, t } = useTheme();
   const { isRepairing, repairDatabase, clearDatabaseCache } = useDatabaseRepair();
   const { hasPin, clearPin } = usePinProtection();
   const [showPinCleared, setShowPinCleared] = React.useState(false);

   // Handler pour un retour "intelligent"
   const handleBack = React.useCallback(() => {
     // Vérifie s'il y a bien une page précédente dans l'historique
     if (window.history.length > 1) {
       navigate(-1);
       setTimeout(() => {
         if (window.location.pathname === "/settings") {
           let targetPath = "/dashboard";
           const dashboardId = localStorage.getItem("currentDashboardId");
           if (dashboardId) {
             targetPath = `/dashboard/${dashboardId}`;
           }
           navigate(targetPath, { replace: true });
         }
       }, 100);
     } else {
       let targetPath = "/dashboard";
       const dashboardId = localStorage.getItem("currentDashboardId");
       if (dashboardId) {
         targetPath = `/dashboard/${dashboardId}`;
       }
       navigate(targetPath, { replace: true });
     }
   }, [navigate]);

-  // Trouver le symbole correspondant à la devise sélectionnée
-  const selectedSymbol = currencyOptions.find(opt => opt.value === currency)?.symbol || "€";
+  // Trouver le symbole correspondant à la devise sélectionnée
+  const selectedSymbol = currencyOptions.find(opt => opt.value === currency)?.symbol || "€";

   const handleLogout = () => {
     clearPin();
     setShowPinCleared(true);
     setTimeout(() => {
       window.location.reload();
     }, 1200);
   };

   return (
     <div className="container mx-auto py-8 space-y-6">
       <div className="flex items-center gap-4">
         <Button 
           variant="outline" 
           size="icon"
           onClick={handleBack}
         >
-          <ArrowLeft className="h-5 w-5" />
+          <ArrowLeft className="h-5 w-5" />
         </Button>
-        <h1 className="text-3xl font-bold">Paramètres</h1>
+        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
       </div>

       <Card>
         <CardHeader>
-          <CardTitle>Affichage</CardTitle>
-          <CardDescription>
-            Personnalisez l'apparence de l'application
-          </CardDescription>
+          <CardTitle>{t("settings.display")}</CardTitle>
+          <CardDescription>
+            {t("settings.displayDesc")}
+          </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="flex items-center justify-between py-2">
             <div>
-              <h3 className="font-medium flex items-center">
-                Mode sombre
-                {darkMode ? <Moon className="ml-2 h-4 w-4" /> : <Sun className="ml-2 h-4 w-4" />}
-              </h3>
-              <p className="text-sm text-muted-foreground">
-                Activez un thème sombre dédié agréable et professionnel
-              </p>
+              <h3 className="font-medium flex items-center">
+                {t("settings.darkMode")}
+                {darkMode ? <Moon className="ml-2 h-4 w-4" /> : <Sun className="ml-2 h-4 w-4" />}
+              </h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.darkModeDesc")}
+              </p>
             </div>
             <Switch 
               checked={darkMode} 
               onCheckedChange={toggleDarkMode}
-              aria-label="Activer le mode sombre"
+              aria-label={t("settings.darkMode")}
             />
           </div>
           <div className="flex items-center justify-between py-2">
             <div>
-              <h3 className="font-medium">Couleurs inversées (expérimental)</h3>
-              <p className="text-sm text-muted-foreground">
-                Inverser toutes les couleurs (peut rendre l'interface imprévisible)
-              </p>
+              <h3 className="font-medium">{t("settings.invertColors")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.invertColorsDesc")}
+              </p>
             </div>
             <Switch 
               checked={invertColors && !darkMode} 
               onCheckedChange={toggleInvertColors}
-              aria-label="Activer l'inversion des couleurs"
+              aria-label={t("settings.invertColors")}
               disabled={darkMode}
             />
           </div>
           <div className="flex items-center justify-between py-2">
             <div>
-              <h3 className="font-medium">Notifications</h3>
-              <p className="text-sm text-muted-foreground">
-                Afficher les notifications temporaires dans l'application
-              </p>
+              <h3 className="font-medium">{t("settings.notifications")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.notificationsDesc")}
+              </p>
             </div>
             <Switch 
               checked={showToasts} 
               onCheckedChange={toggleShowToasts} 
             />
           </div>
+          <div className="flex items-center justify-between py-2">
+            <div>
+              <h3 className="font-medium">{t("settings.language")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.languageDesc")}
+              </p>
+            </div>
+            <Select value={language} onValueChange={setLanguage}>
+              <SelectTrigger className="w-40">
+                <SelectValue>
+                  {supportedLanguages.find(l => l.value === language)?.label}
+                </SelectValue>
+              </SelectTrigger>
+              <SelectContent>
+                {supportedLanguages.map(lang => (
+                  <SelectItem key={lang.value} value={lang.value}>
+                    {lang.label}
+                  </SelectItem>
+                ))}
+              </SelectContent>
+            </Select>
+          </div>
           <div className="flex items-center justify-between py-2">
             <div>
-              <h3 className="font-medium">Devise utilisée</h3>
-              <p className="text-sm text-muted-foreground">
-                Choisissez la devise qui s'affichera dans toute l'application.
-              </p>
+              <h3 className="font-medium">{t("settings.currency")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.currencyDesc")}
+              </p>
             </div>
             <Select value={currency} onValueChange={(val) => setCurrency(val as any)}>
               <SelectTrigger className="w-36">
                 {/* Montre seulement le symbole dans le champ fermé */}
                 <SelectValue>
                   {selectedSymbol}
                 </SelectValue>
               </SelectTrigger>
               <SelectContent>
-                {currencyOptions.map((opt) => (
-                  <SelectItem key={opt.value} value={opt.value}>
-                    {opt.label}
-                  </SelectItem>
-                ))}
+                {currencyOptions.map((opt) => (
+                  <SelectItem key={opt.value} value={opt.value}>
+                    {opt.label}
+                  </SelectItem>
+                ))}
               </SelectContent>
             </Select>
           </div>
         </CardContent>
       </Card>
 
       <Card>
         <CardHeader>
-          <CardTitle>Maintenance de la base de données</CardTitle>
-          <CardDescription>
-            Outils de réparation en cas de problème avec la base de données
-          </CardDescription>
+          <CardTitle>{t("settings.maintenance")}</CardTitle>
+          <CardDescription>
+            {t("settings.maintenanceDesc")}
+          </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="flex flex-col gap-4">
             <div className="space-y-2">
-              <h3 className="font-medium">Réinitialiser la connexion</h3>
-              <p className="text-sm text-muted-foreground">
-                Réinitialise la connexion à la base de données en cas de problème de communication
-              </p>
-              <Button 
-                onClick={repairDatabase} 
-                disabled={isRepairing}
-                className="mt-2"
-                variant="outline"
-              >
-                <Database className="mr-2 h-4 w-4" />
-                {isRepairing ? "Réparation en cours..." : "Réparer la connexion"}
-              </Button>
+              <h3 className="font-medium">{t("settings.resetConnection")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.resetConnectionDesc")}
+              </p>
+              <Button 
+                onClick={repairDatabase} 
+                disabled={isRepairing}
+                className="mt-2"
+                variant="outline"
+              >
+                <Database className="mr-2 h-4 w-4" />
+                {isRepairing ? t("settings.repairing") : t("settings.repair")}
+              </Button>
             </div>
             
             <div className="pt-4 border-t space-y-2">
-              <h3 className="font-medium">Nettoyage avancé</h3>
-              <p className="text-sm text-muted-foreground">
-                Supprime le cache de la base de données et force une réinitialisation complète
-              </p>
-              <Button 
-                onClick={clearDatabaseCache} 
-                disabled={isRepairing}
-                className="mt-2"
-                variant="destructive"
-              >
-                <Trash className="mr-2 h-4 w-4" />
-                {isRepairing ? "Nettoyage en cours..." : "Nettoyer le cache"}
-              </Button>
-              <p className="text-xs text-muted-foreground mt-2">
-                Attention : Utilisez cette option uniquement en dernier recours. Les données ne seront pas perdues, mais l'application peut être temporairement indisponible pendant la réinitialisation.
-              </p>
+              <h3 className="font-medium">{t("settings.advancedCleanup")}</h3>
+              <p className="text-sm text-muted-foreground">
+                {t("settings.advancedCleanupDesc")}
+              </p>
+              <Button 
+                onClick={clearDatabaseCache} 
+                disabled={isRepairing}
+                className="mt-2"
+                variant="destructive"
+              >
+                <Trash className="mr-2 h-4 w-4" />
+                {isRepairing ? t("settings.cleaning") : t("settings.clean")}
+              </Button>
+              <p className="text-xs text-muted-foreground mt-2">
+                {t("settings.cleanWarn")}
+              </p>
             </div>
           </div>
         </CardContent>
       </Card>
 
       {hasPin && (
         <Card>
           <CardHeader>
-            <CardTitle>Déconnexion sécurisée</CardTitle>
-            <CardDescription>
-              Supprime votre code PIN et déconnecte l’accès à l’application. Il vous sera demandé d’en recréer un à la prochaine ouverture.
-            </CardDescription>
+            <CardTitle>{t("settings.logoutTitle")}</CardTitle>
+            <CardDescription>
+              {t("settings.logoutDesc")}
+            </CardDescription>
           </CardHeader>
           <CardContent>
             <Button
               variant="destructive"
               onClick={handleLogout}
               className="w-full"
             >
-              Se déconnecter / Réinitialiser le code PIN
+              {t("settings.logout")}
             </Button>
             {showPinCleared && (
-              <p className="text-green-600 text-sm mt-4">Déconnexion réussie.</p>
+              <p className="text-green-600 text-sm mt-4">{t("settings.logoutSuccess")}</p>
             )}
           </CardContent>
         </Card>
       )}
     </div>
   );
 };
 
 export default Settings;

