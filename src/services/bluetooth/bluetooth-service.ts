
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
      if (navigator.share && navigator.canShare) {
        console.log("API Web Share disponible");
        return true;
      }
      
      // Vérifier l'API Bluetooth si disponible
      if (navigator.bluetooth) {
        console.log("API Bluetooth disponible, vérification de l'activation...");
        const available = await navigator.bluetooth.getAvailability();
        console.log(`Bluetooth disponible: ${available}`);
        return available;
      }
      
      console.log("Aucune API de partage détectée");
      // Sur mobile, considérer comme disponible par défaut pour d'autres mécanismes de partage
      return this.isMobileDevice();
    } catch (error) {
      console.error("Erreur lors de la vérification du Bluetooth:", error);
      // Sur erreur, considérer comme disponible sur mobile (pour permettre d'autres méthodes)
      return this.isMobileDevice();
    }
  }
  
  /**
   * Détecte si l'appareil est un mobile
   */
  static isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
  }
  
  /**
   * Partage les dépenses via Bluetooth ou autre méthode disponible
   */
  static async shareExpensesViaBluetooth(expenses: any[]): Promise<boolean> {
    try {
      if (expenses.length === 0) {
        throw new Error("Aucune dépense à partager");
      }
      
      // Formatter les données à partager
      const expensesData = JSON.stringify(expenses);
      const blob = new Blob([expensesData], { type: 'application/json' });
      const file = new File([blob], 'expenses.json', { type: 'application/json' });
      
      // Utiliser l'API Web Share si disponible (plus fiable)
      if (navigator.share && navigator.canShare({ files: [file] })) {
        console.log("Partage via Web Share API");
        await navigator.share({
          files: [file],
          title: 'Dépenses partagées',
          text: `${expenses.length} dépense(s) partagée(s)`
        });
        return true;
      }
      
      // Fallback pour le téléchargement direct
      console.log("Fallback: téléchargement direct du fichier");
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Erreur lors du partage des dépenses:", error);
      throw error;
    }
  }
  
  /**
   * Reçoit les dépenses depuis un fichier
   */
  static async receiveExpensesFromFile(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
        // Créer un input file invisible
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';
        
        input.onchange = async (event) => {
          const target = event.target as HTMLInputElement;
          if (!target.files || target.files.length === 0) {
            reject(new Error("Aucun fichier sélectionné"));
            return;
          }
          
          const file = target.files[0];
          try {
            const text = await file.text();
            const expenses = JSON.parse(text);
            
            // Vérifier que les données sont au bon format
            if (!Array.isArray(expenses)) {
              reject(new Error("Format de données invalide"));
              return;
            }
            
            document.body.removeChild(input);
            resolve(expenses);
          } catch (error) {
            console.error("Erreur lors de la lecture du fichier:", error);
            reject(new Error("Impossible de lire le fichier"));
          }
        };
        
        // Ajouter l'input au DOM et déclencher le clic
        document.body.appendChild(input);
        input.click();
      } catch (error) {
        console.error("Erreur lors de la réception des dépenses:", error);
        reject(error);
      }
    });
  }
}
