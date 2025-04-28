
/**
 * Formate un montant en euros avec le symbole € et deux décimales
 */
export const formatAmount = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Utiliser l'API Intl pour formater correctement en fonction de la locale
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};
