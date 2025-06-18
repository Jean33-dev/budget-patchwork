
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 * Utilise uniquement du formatage manuel pour éviter les problèmes Unicode avec @react-pdf/renderer
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Vérifier si le montant est valide
  if (isNaN(numAmount)) {
    return "0,00 €";
  }
  
  // Obtenir la valeur absolue pour le formatage
  const absAmount = Math.abs(numAmount);
  
  // Convertir en centimes pour éviter les problèmes de précision
  const cents = Math.round(absAmount * 100);
  const euros = Math.floor(cents / 100);
  const centimes = cents % 100;
  
  // Convertir la partie entière en string
  const integerStr = euros.toString();
  
  // Ajouter les séparateurs de milliers manuellement
  let formattedInteger = '';
  const len = integerStr.length;
  
  for (let i = 0; i < len; i++) {
    // Ajouter un espace tous les 3 chiffres en partant de la droite
    if (i > 0 && (len - i) % 3 === 0) {
      formattedInteger += ' ';
    }
    formattedInteger += integerStr[i];
  }
  
  // Formater les centimes avec un zéro devant si nécessaire
  const formattedCentimes = centimes.toString().padStart(2, '0');
  
  // Construire le montant final
  const finalAmount = `${formattedInteger},${formattedCentimes}`;
  
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
  
  // Format final : signe + montant + espace + symbole
  return `${sign}${finalAmount} ${symbol}`;
};
