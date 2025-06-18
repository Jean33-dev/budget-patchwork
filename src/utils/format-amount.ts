
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
  const fixedAmount = absAmount.toFixed(2);
  
  // Séparer la partie entière et décimale
  const [integerPart, decimalPart] = fixedAmount.split('.');
  
  // Ajouter les espaces comme séparateurs de milliers de façon plus simple
  let formattedInteger = '';
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedInteger += ' ';
    }
    formattedInteger += integerPart[i];
  }
  
  // Construire le montant final avec virgule comme séparateur décimal
  const finalAmount = `${formattedInteger},${decimalPart}`;
  
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
