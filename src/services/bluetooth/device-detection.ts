
/**
 * Utilitaires pour la détection des appareils et des capacités de partage
 */
export class DeviceDetectionService {
  /**
   * Détecte si l'appareil est un mobile
   */
  static isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
  }

  /**
   * Vérifie si l'API Web Share est disponible
   */
  static isWebShareAvailable(): boolean {
    return !!(navigator.share && navigator.canShare);
  }

  /**
   * Vérifie si l'API Bluetooth est disponible
   */
  static async isBluetoothApiAvailable(): Promise<boolean> {
    try {
      if (!navigator.bluetooth) {
        console.log("API Bluetooth non disponible");
        return false;
      }
      
      console.log("API Bluetooth disponible, vérification de l'activation...");
      const available = await navigator.bluetooth.getAvailability();
      console.log(`Bluetooth disponible: ${available}`);
      return available;
    } catch (error) {
      console.error("Erreur lors de la vérification du Bluetooth:", error);
      return false;
    }
  }
}
