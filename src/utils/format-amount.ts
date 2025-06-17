
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Formater le nombre avec 2 décimales
  const fixedAmount = numAmount.toFixed(2);
  
  // Séparer la partie entière et décimale
  const [integerPart, decimalPart] = fixedAmount.split('.');
  
  // Ajouter les séparateurs de milliers manuellement
  let formattedInteger = '';
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedInteger += ' '; // Utiliser un espace normal comme séparateur
    }
    formattedInteger += integerPart[i];
  }
  
  // Assembler le montant formaté avec le symbole de devise
  let result = '';
  switch (currency) {
    case "EUR":
      result = `${formattedInteger},${decimalPart} €`;
      break;
    case "USD":
      result = `$${formattedInteger}.${decimalPart}`;
      break;
    case "GBP":
      result = `£${formattedInteger}.${decimalPart}`;
      break;
    default:
      result = `${formattedInteger},${decimalPart} €`;
  }
  
  return result;
};
