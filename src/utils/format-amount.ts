
/**
 * Formate un montant dans la devise indiquée, avec le symbole et le bon format
 */
export const formatAmount = (amount: number | string, currency: "EUR" | "USD" | "GBP" = "EUR"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  let currencyDisplay: "symbol" | "narrowSymbol" = "symbol";
  let locale = "fr-FR";

  if (currency === "USD") locale = "en-US";
  if (currency === "GBP") locale = "en-GB";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};
