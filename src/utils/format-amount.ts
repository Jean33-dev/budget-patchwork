
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  let locale = "fr-FR";

  if (currency ===  "USD") locale = "en-US";
  if (currency === "GBP") locale = "en-GB";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    // Cette option permet d'utiliser des espaces comme séparateur de milliers pour EUR
    // Nous utiliserons les formats standards pour USD et GBP
    useGrouping: true
  }).format(numAmount);
};
