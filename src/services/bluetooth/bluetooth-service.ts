
import { DeviceDetectionService } from "./device-detection";
import { ShareService } from "./share-service";
import { FileService } from "./file-service";

/**
 * Service pour gérer les fonctionnalités Bluetooth et de partage
 */
export class BluetoothService {
  /**
   * Vérifie si le Bluetooth ou toute autre méthode de partage est disponible
   */
  static async isBluetoothAvailable(): Promise<boolean> {
    try {
      // Vérifier d'abord l'API Web Share si disponible (plus simple et plus fiable)
      if (DeviceDetectionService.isWebShareAvailable()) {
        console.log("API Web Share disponible");
        return true;
      }
      
      // Vérifier l'API Bluetooth si disponible
      const bluetoothAvailable = await DeviceDetectionService.isBluetoothApiAvailable();
      
      if (bluetoothAvailable) {
        return true;
      }
      
      console.log("Aucune API de partage détectée");
      // Sur mobile, considérer comme disponible par défaut pour d'autres mécanismes de partage
      return DeviceDetectionService.isMobileDevice();
    } catch (error) {
      console.error("Erreur lors de la vérification du Bluetooth:", error);
      // Sur erreur, considérer comme disponible sur mobile (pour permettre d'autres méthodes)
      return DeviceDetectionService.isMobileDevice();
    }
  }
  
  /**
   * Partage les dépenses via Bluetooth ou autre méthode disponible
   */
  static async shareExpensesViaBluetooth(expenses: any[]): Promise<boolean> {
    try {
      if (expenses.length === 0) {
        throw new Error("Aucune dépense à partager");
      }
      
      // Utiliser l'API Web Share si disponible (plus fiable)
      if (DeviceDetectionService.isWebShareAvailable()) {
        return await ShareService.shareViaWebShare(
          expenses,
          'Dépenses partagées',
          `${expenses.length} dépense(s) partagée(s)`
        );
      }
      
      // Fallback pour le téléchargement direct
      return ShareService.shareViaDownload(expenses);
    } catch (error) {
      console.error("Erreur lors du partage des dépenses:", error);
      throw error;
    }
  }
  
  /**
   * Reçoit les dépenses depuis un fichier
   */
  static async receiveExpensesFromFile(): Promise<any[]> {
    return FileService.readJsonFile();
  }
}
