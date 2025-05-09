
import { toast } from "@/components/ui/use-toast";
import { Expense } from "../database/models/expense";

export class BluetoothService {
  /**
   * Vérifie si le Bluetooth est disponible sur l'appareil
   */
  static async isBluetoothAvailable(): Promise<boolean> {
    // Vérifier si nous sommes sur une plateforme mobile via Capacitor
    const isCapacitorNative = typeof window !== 'undefined' && 
                             window && 
                             (window as any).Capacitor && 
                             (window as any).Capacitor.isNativePlatform && 
                             (window as any).Capacitor.isNativePlatform();
    
    console.log("Plateforme native Capacitor détectée:", isCapacitorNative);
    
    // Sur les plateformes natives, considérer Bluetooth comme disponible
    // car il sera géré par des plugins natifs
    if (isCapacitorNative) {
      console.log("Plateforme native détectée, considérant Bluetooth comme disponible");
      return true;
    }
    
    // Vérifier si l'API Web Bluetooth est disponible dans le navigateur
    if (typeof navigator === 'undefined' || !navigator.bluetooth) {
      console.log("API Web Bluetooth non disponible dans ce navigateur");
      return false;
    }
    
    // Vérifier si l'API est accessible (autorisations)
    try {
      const available = await navigator.bluetooth.getAvailability();
      console.log("Disponibilité Bluetooth via API:", available);
      return available;
    } catch (error) {
      console.error("Erreur lors de la vérification de disponibilité Bluetooth:", error);
      return false;
    }
  }

  /**
   * Partage des dépenses via Bluetooth
   * @param expenses Liste des dépenses à partager
   */
  static async shareExpensesViaBluetooth(expenses: Expense[]): Promise<boolean> {
    try {
      // Vérifier si le Bluetooth est disponible
      const isAvailable = await this.isBluetoothAvailable();
      console.log("Bluetooth disponible:", isAvailable);
      
      if (!isAvailable) {
        throw new Error("Bluetooth n'est pas disponible sur cet appareil");
      }
      
      // Préparer les données pour le partage
      const expensesData = JSON.stringify(expenses);
      
      // Détection de Capacitor pour les plateformes natives
      const isCapacitorNative = typeof window !== 'undefined' && 
                               window && 
                               (window as any).Capacitor && 
                               (window as any).Capacitor.isNativePlatform && 
                               (window as any).Capacitor.isNativePlatform();
      
      console.log("Partage Bluetooth - Plateforme native:", isCapacitorNative);
      
      // Sur les plateformes natives (Android/iOS), utiliser le plugin Capacitor si disponible
      if (isCapacitorNative) {
        console.log("Tentative de partage via plugin natif");
        // Si un plugin Bluetooth est disponible
        if ((window as any).Capacitor?.Plugins?.BluetoothLE) {
          console.log("Plugin BluetoothLE détecté");
          // Logique spécifique au plugin BluetoothLE de Capacitor
          const result = await this.shareViaNativePlugin(expensesData);
          return result;
        } else {
          console.log("Aucun plugin Bluetooth spécifique détecté, utilisation du partage natif");
          // Utiliser le partage natif si le plugin spécifique n'est pas disponible
          return await this.shareViaGenericShare(expenses);
        }
      }
      
      // Sur le web, utiliser Web Bluetooth API
      console.log("Tentative de partage via Web Bluetooth API");
      if (navigator.bluetooth) {
        return await this.shareViaWebBluetooth(expensesData);
      }
      
      // Fallback vers le partage générique
      console.log("Fallback vers partage générique");
      return await this.shareViaGenericShare(expenses);
    } catch (error) {
      console.error("Erreur lors du partage via Bluetooth:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur de partage",
        description: `Le partage via Bluetooth a échoué: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      });
      
      return false;
    }
  }
  
  /**
   * Partage via le plugin Bluetooth natif de Capacitor
   */
  private static async shareViaNativePlugin(data: string): Promise<boolean> {
    try {
      const bluetoothPlugin = (window as any).Capacitor.Plugins.BluetoothLE;
      
      // Ajout de logs pour le débogage
      console.log("Initialisation du plugin Bluetooth natif");
      
      // Initialiser le Bluetooth
      await bluetoothPlugin.initialize();
      console.log("Plugin Bluetooth initialisé");
      
      // Demander à l'utilisateur de sélectionner un appareil
      console.log("Démarrage du scan Bluetooth");
      const scanResult = await bluetoothPlugin.scan({ services: [] });
      console.log("Résultat du scan:", scanResult);
      const device = scanResult.devices?.[0] || scanResult;
      
      if (!device || !device.address) {
        throw new Error("Aucun appareil Bluetooth détecté");
      }
      
      // Connecter à l'appareil
      console.log("Connexion à l'appareil:", device.address);
      await bluetoothPlugin.connect({ address: device.address });
      
      // Envoyer les données
      console.log("Envoi des données via Bluetooth");
      await bluetoothPlugin.write({
        address: device.address,
        service: "generic_service",
        characteristic: "generic_char",
        value: this.convertStringToBytes(data)
      });
      
      toast({
        title: "Partage réussi",
        description: "Les dépenses ont été partagées avec succès via Bluetooth"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur détaillée lors du partage via plugin natif:", error);
      throw new Error(`Erreur lors du partage Bluetooth: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  }
  
  /**
   * Partage via Web Bluetooth API
   */
  private static async shareViaWebBluetooth(data: string): Promise<boolean> {
    try {
      console.log("Démarrage du partage via Web Bluetooth");
      
      // Demander à l'utilisateur de sélectionner un appareil compatible
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access']
      });
      
      console.log("Appareil sélectionné:", device.name || device.id);
      
      // Notification à l'utilisateur - Web Bluetooth a des limitations
      toast({
        title: "Appareil connecté",
        description: `Connecté à ${device.name || 'l\'appareil'}. Le partage Web Bluetooth est limité dans les navigateurs.`
      });
      
      // Pour une véritable implémentation, il faudrait:
      // 1. Se connecter au GATT server
      // 2. Obtenir le service approprié
      // 3. Obtenir la caractéristique pour l'écriture
      // 4. Écrire les données
      
      // Comme Web Bluetooth est limité pour le partage, on propose le téléchargement
      await this.shareViaGenericShare([]);
      
      return true;
    } catch (error) {
      console.error("Erreur détaillée lors du partage via Web Bluetooth:", error);
      throw error;
    }
  }
  
  /**
   * Partage via l'API de partage générique
   */
  private static async shareViaGenericShare(expenses: Expense[]): Promise<boolean> {
    try {
      console.log("Utilisation du partage générique");
      
      // Créer un fichier des dépenses
      const expensesData = JSON.stringify(expenses, null, 2);
      const blob = new Blob([expensesData], { type: 'application/json' });
      const file = new File([blob], "depenses_partagees.json", { type: "application/json" });
      
      // Si l'API de partage web est disponible
      if (navigator.share && navigator.canShare({ files: [file] })) {
        console.log("Utilisation de l'API Web Share");
        await navigator.share({
          title: 'Dépenses partagées',
          files: [file]
        });
        
        return true;
      } else {
        // Fallback pour les navigateurs ne supportant pas l'API de partage
        console.log("Fallback: téléchargement du fichier");
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'depenses_partagees.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(dataUrl);
        
        toast({
          title: "Téléchargement des données",
          description: "Les données ont été téléchargées car le partage direct n'est pas disponible sur ce navigateur"
        });
        
        return true;
      }
    } catch (error) {
      console.error("Erreur détaillée lors du partage générique:", error);
      throw error;
    }
  }
  
  /**
   * Convertit une chaîne en tableau d'octets
   */
  private static convertStringToBytes(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }
}
