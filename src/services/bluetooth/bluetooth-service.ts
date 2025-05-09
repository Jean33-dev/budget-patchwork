
import { toast } from "@/components/ui/use-toast";
import { Expense } from "../database/models/expense";

export class BluetoothService {
  /**
   * Vérifie si le Bluetooth est disponible sur l'appareil
   */
  static async isBluetoothAvailable(): Promise<boolean> {
    // Vérifier si l'API Web Bluetooth est disponible
    if (typeof navigator === 'undefined' || !navigator.bluetooth) {
      if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
        // Sur les plateformes natives, on suppose que le Bluetooth est disponible
        // et sera géré par un plugin Capacitor
        return true;
      }
      return false;
    }
    
    // Vérifier si l'API est accessible (autorisations)
    try {
      await navigator.bluetooth.getAvailability();
      return true;
    } catch (error) {
      console.error("Bluetooth n'est pas disponible:", error);
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
      
      if (!isAvailable) {
        throw new Error("Bluetooth n'est pas disponible sur cet appareil");
      }
      
      // Préparer les données pour le partage
      const expensesData = JSON.stringify(expenses);
      
      // Sur les plateformes natives (Android/iOS), utiliser le plugin Capacitor
      if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
        // Si un plugin Bluetooth est disponible
        if ((window as any).Capacitor?.Plugins?.BluetoothLE) {
          // Logique spécifique au plugin BluetoothLE de Capacitor
          const result = await this.shareViaNativePlugin(expensesData);
          return result;
        } else {
          // Utiliser le partage natif si le plugin spécifique n'est pas disponible
          return await this.shareViaGenericShare(expenses);
        }
      }
      
      // Sur le web, utiliser Web Bluetooth API si disponible
      if (navigator.bluetooth) {
        return await this.shareViaWebBluetooth(expensesData);
      }
      
      // Fallback vers le partage générique
      return await this.shareViaGenericShare(expenses);
    } catch (error) {
      console.error("Erreur lors du partage via Bluetooth:", error);
      
      const showToasts = localStorage.getItem('showToasts') !== 'false';
      if (showToasts) {
        toast({
          variant: "destructive",
          title: "Erreur de partage",
          description: "Le partage via Bluetooth a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue")
        });
      }
      
      return false;
    }
  }
  
  /**
   * Partage via le plugin Bluetooth natif de Capacitor
   */
  private static async shareViaNativePlugin(data: string): Promise<boolean> {
    try {
      const bluetoothPlugin = (window as any).Capacitor.Plugins.BluetoothLE;
      
      // Ces fonctions dépendent de l'API spécifique du plugin utilisé
      // Initialiser le Bluetooth
      await bluetoothPlugin.initialize();
      
      // Demander à l'utilisateur de sélectionner un appareil
      const device = await bluetoothPlugin.scan({ services: [] });
      
      // Connecter à l'appareil
      await bluetoothPlugin.connect({ address: device.address });
      
      // Envoyer les données (dépend des spécificités du plugin)
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
      console.error("Erreur lors du partage via plugin natif:", error);
      throw error;
    }
  }
  
  /**
   * Partage via Web Bluetooth API
   */
  private static async shareViaWebBluetooth(data: string): Promise<boolean> {
    try {
      // Web Bluetooth API est principalement pour la lecture et non l'écriture
      // Cette fonctionnalité est limitée et peut ne pas fonctionner dans tous les navigateurs
      // Pour simplifier, nous allons juste simuler le partage
      
      console.log("Tentative de partage via Web Bluetooth");
      
      // Simuler la demande d'un appareil Bluetooth
      await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      // En réalité, Web Bluetooth est limité pour le partage de fichiers
      toast({
        title: "Partage limité",
        description: "Le partage Bluetooth est limité dans l'environnement web. Utilisez l'application mobile pour un partage complet."
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors du partage via Web Bluetooth:", error);
      throw error;
    }
  }
  
  /**
   * Partage via l'API de partage générique
   */
  private static async shareViaGenericShare(expenses: Expense[]): Promise<boolean> {
    try {
      // Créer un fichier des dépenses
      const expensesData = JSON.stringify(expenses, null, 2);
      const blob = new Blob([expensesData], { type: 'application/json' });
      const file = new File([blob], "depenses_partagees.json", { type: "application/json" });
      
      // Si l'API de partage web est disponible
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Dépenses partagées',
          files: [file]
        });
        
        return true;
      } else {
        // Fallback pour les navigateurs ne supportant pas l'API de partage
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'depenses_partagees.json';
        link.click();
        URL.revokeObjectURL(dataUrl);
        
        toast({
          title: "Téléchargement des données",
          description: "Les données ont été téléchargées car le partage direct n'est pas disponible sur ce navigateur"
        });
        
        return true;
      }
    } catch (error) {
      console.error("Erreur lors du partage générique:", error);
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
