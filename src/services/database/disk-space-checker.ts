
import { toast } from "@/components/ui/use-toast";

export interface StorageQuotaInfo {
  quota: number;        // Total space alloué en octets
  usage: number;        // Espace actuellement utilisé en octets
  available: number;    // Espace disponible en octets
  isLimited: boolean;   // Si la plateforme impose une limite ou non
}

/**
 * Service pour vérifier l'espace disque disponible avant d'effectuer des opérations de stockage
 */
export class DiskSpaceChecker {
  // Taille minimale requise par défaut (5 MB)
  private static MIN_REQUIRED_SPACE = 5 * 1024 * 1024;
  
  /**
   * Définir la taille minimale requise pour les opérations
   */
  static setMinRequiredSpace(bytes: number): void {
    this.MIN_REQUIRED_SPACE = bytes;
  }
  
  /**
   * Vérifier si l'espace disponible est suffisant
   * @returns true si l'espace est suffisant, false sinon
   */
  static async hasEnoughSpace(estimatedSize?: number): Promise<boolean> {
    try {
      const storageInfo = await this.getStorageQuotaInfo();
      const requiredSpace = estimatedSize || this.MIN_REQUIRED_SPACE;
      
      // Si la plateforme n'a pas de limite, on considère qu'il y a assez d'espace
      if (!storageInfo.isLimited) {
        return true;
      }
      
      const hasEnoughSpace = storageInfo.available >= requiredSpace;
      
      if (!hasEnoughSpace) {
        console.warn("Espace de stockage insuffisant:", {
          available: this.formatBytes(storageInfo.available),
          required: this.formatBytes(requiredSpace),
          quota: this.formatBytes(storageInfo.quota),
          used: this.formatBytes(storageInfo.usage)
        });
        
        // Vérifier la préférence utilisateur avant d'afficher le toast
        const showToastsPreference = localStorage.getItem("showToasts");
        if (showToastsPreference !== "false") {
          // Afficher une alerte à l'utilisateur uniquement si les toasts sont activés
          toast({
            variant: "destructive",
            title: "Espace de stockage insuffisant",
            description: `L'opération nécessite ${this.formatBytes(requiredSpace)} mais seulement ${this.formatBytes(storageInfo.available)} sont disponibles. Veuillez libérer de l'espace pour continuer à utiliser l'application.`,
            duration: 6000, // Un peu plus long pour que l'utilisateur ait le temps de lire
          });
        }
      }
      
      return hasEnoughSpace;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'espace disponible:", error);
      // En cas d'erreur, on suppose qu'il y a assez d'espace pour éviter de bloquer l'application
      return true;
    }
  }
  
  /**
   * Récupérer les informations sur l'espace de stockage disponible
   */
  static async getStorageQuotaInfo(): Promise<StorageQuotaInfo> {
    // Pour le navigateur web, utiliser l'API Storage Estimate
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0),
          isLimited: !!estimate.quota
        };
      } catch (webError) {
        console.error("Erreur lors de l'estimation du stockage web:", webError);
      }
    }
    
    // Pour les environnements Capacitor/natifs
    if (typeof (window as any)?.Capacitor?.isNativePlatform === 'function' && 
        (window as any).Capacitor.isNativePlatform()) {
      try {
        // Essayer d'utiliser le plugin Filesystem de Capacitor s'il est disponible
        if ((window as any).Capacitor.Plugins?.Filesystem) {
          const filesystem = (window as any).Capacitor.Plugins.Filesystem;
          const info = await filesystem.getFreeDiskStorageSync();
          
          if (info && typeof info.freeDiskStorage === 'number') {
            // Supposer une valeur raisonnable pour la taille totale si non disponible
            const totalStorage = info.totalDiskStorage || 1024 * 1024 * 1024 * 32; // 32 GB par défaut
            return {
              quota: totalStorage,
              usage: totalStorage - info.freeDiskStorage,
              available: info.freeDiskStorage,
              isLimited: true
            };
          }
        }
      } catch (nativeError) {
        console.error("Erreur lors de l'estimation du stockage natif:", nativeError);
      }
    }
    
    // Valeurs par défaut si aucune méthode ne fonctionne
    // Supposer qu'il y a au moins 50 MB disponibles
    return {
      quota: 1024 * 1024 * 100, // 100 MB
      usage: 1024 * 1024 * 50,   // 50 MB
      available: 1024 * 1024 * 50, // 50 MB
      isLimited: false
    };
  }
  
  /**
   * Formater une taille en octets en une chaîne plus lisible
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
