
import { useAppSettings } from "@/contexts/AppSettingsContext";

export function useCurrencyFormatter() {
  const { settings } = useAppSettings();
  
  const formatCurrency = (amount: number) => {
    let symbol = "€";
    let locale = "fr-FR";
    
    switch (settings.currency) {
      case "USD":
        symbol = "$";
        locale = "en-US";
        break;
      case "GBP":
        symbol = "£";
        locale = "en-GB";
        break;
      case "CAD":
        symbol = "$";
        locale = "en-CA";
        break;
      case "CHF":
        symbol = "CHF";
        locale = "fr-CH";
        break;
      default:
        symbol = "€";
        locale = "fr-FR";
    }
    
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return { formatCurrency };
}
