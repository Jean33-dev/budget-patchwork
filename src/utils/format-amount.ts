
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

  // Paramètres spécifiques par devise pour éviter les problèmes d'affichage dans les PDFs
  switch (currency) {
    case "EUR":
      return new Intl.NumberFormat("fr-FR", formatOptions).format(numAmount);
    case "USD":
      return new Intl.NumberFormat("en-US", formatOptions).format(numAmount);
    case "GBP":
      return new Intl.NumberFormat("en-GB", formatOptions).format(numAmount);
    default:
      return new Intl.NumberFormat("fr-FR", formatOptions).format(numAmount);
  }
};
