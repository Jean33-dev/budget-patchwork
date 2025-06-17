
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Définir les options de formatage spécifiques pour chaque devise
  let formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  };

  // Obtenir le format de base
  let formatted: string;
  switch (currency) {
    case "EUR":
      formatted = new Intl.NumberFormat("fr-FR", formatOptions).format(numAmount);
      break;
    case "USD":
      formatted = new Intl.NumberFormat("en-US", formatOptions).format(numAmount);
      break;
    case "GBP":
      formatted = new Intl.NumberFormat("en-GB", formatOptions).format(numAmount);
      break;
    default:
      formatted = new Intl.NumberFormat("fr-FR", formatOptions).format(numAmount);
  }

  // Remplacer les caractères Unicode problématiques par des séparateurs compatibles PDF
  // \u00A0 = espace insécable, \u202F = espace fine, etc.
  formatted = formatted.replace(/[\u00A0\u202F\u2009\u200A]/g, ' '); // Remplacer les espaces Unicode par des espaces normaux
  formatted = formatted.replace(/\//g, ' '); // Remplacer les barres obliques par des espaces
  
  return formatted;
};
