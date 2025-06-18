
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Vérifier si le montant est valide
  if (isNaN(numAmount)) {
    return "0,00 €";
  }
  
  // Formatage manuel pour éviter les problèmes avec le PDF
  const absAmount = Math.abs(numAmount);
  const formattedNumber = absAmount.toFixed(2).replace('.', ',');
  
  // Ajouter les séparateurs de milliers (espaces)
  const parts = formattedNumber.split(',');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const finalAmount = parts.join(',');
  
  // Ajouter le signe négatif si nécessaire
  const sign = numAmount < 0 ? '-' : '';
  
  // Déterminer le symbole de devise
  let symbol = '€';
  switch (currency) {
    case "USD":
      symbol = '$';
      break;
    case "GBP":
      symbol = '£';
      break;
    case "EUR":
    default:
      symbol = '€';
      break;
  }
  
  // Format français : montant + espace + symbole
  return `${sign}${finalAmount} ${symbol}`;
};
