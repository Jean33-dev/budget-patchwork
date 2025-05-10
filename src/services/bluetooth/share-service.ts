
import { DeviceDetectionService } from "./device-detection";
import { FileService } from "./file-service";

/**
 * Service pour gérer les fonctionnalités de partage
 */
export class ShareService {
  /**
   * Partage des données via l'API Web Share
   */
  static async shareViaWebShare(data: any[], title: string = 'Données partagées', text: string = 'Données partagées'): Promise<boolean> {
    try {
      if (!DeviceDetectionService.isWebShareAvailable()) {
        console.log("API Web Share non disponible");
        return false;
      }
      
      const file = FileService.createJsonFile(data, 'expenses.json');
      
      if (!navigator.canShare({ files: [file] })) {
        console.log("Le partage de fichiers n'est pas pris en charge");
        return false;
      }
      
      console.log("Partage via Web Share API");
      await navigator.share({
        files: [file],
        title: title,
        text: text
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors du partage via Web Share:", error);
      throw error;
    }
  }

  /**
   * Partage des données via téléchargement direct (fallback)
   */
  static shareViaDownload(data: any[]): boolean {
    try {
      console.log("Partage via téléchargement direct");
      const file = FileService.createJsonFile(data, 'expenses.json');
      FileService.downloadFile(file);
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      throw error;
    }
  }
}
