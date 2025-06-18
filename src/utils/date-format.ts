
/**
 * Formate une date au format français (jj/mm/aaaa)
 */
export const formatDateFrench = (dateString: string): string => {
  try {
    // Si la date est déjà au format jj/mm/aaaa, on la retourne telle quelle
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return dateString;
    }
    
    // Si la date est au format ISO (aaaa-mm-jj)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${parseInt(day)}/${parseInt(month)}/${year}`;
    }
    
    // Essayer de parser la date avec Date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Retourner la date originale si elle n'est pas valide
    }
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return dateString; // Retourner la date originale en cas d'erreur
  }
};
