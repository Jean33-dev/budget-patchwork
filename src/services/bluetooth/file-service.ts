
/**
 * Service pour gérer les opérations de fichiers
 */
export class FileService {
  /**
   * Crée un fichier JSON à partir de données
   */
  static createJsonFile(data: any, filename: string = 'data.json'): File {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return new File([blob], filename, { type: 'application/json' });
  }

  /**
   * Déclenche le téléchargement direct d'un fichier
   */
  static downloadFile(file: File): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Ouvre un sélecteur de fichier et lit le contenu du fichier sélectionné
   */
  static readJsonFile(): Promise<any[]> {
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
            const data = JSON.parse(text);
            
            // Vérifier que les données sont au bon format
            if (!Array.isArray(data)) {
              reject(new Error("Format de données invalide"));
              return;
            }
            
            document.body.removeChild(input);
            resolve(data);
          } catch (error) {
            console.error("Erreur lors de la lecture du fichier:", error);
            reject(new Error("Impossible de lire le fichier"));
          }
        };
        
        // Ajouter l'input au DOM et déclencher le clic
        document.body.appendChild(input);
        input.click();
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier:", error);
        reject(error);
      }
    });
  }
}
