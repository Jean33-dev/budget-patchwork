
import dashboard from "./dashboard";
import budgets from "./budgets";
import expenses from "./expenses";
import pdf from "./pdf";
import bluetooth from "./bluetooth";
import footer from "./footer";
import envelope from "./envelope";
import settings from "./settings";
import transition from "./transition";
import home from "./home";

const frTranslations: Record<string, string> = {
  ...settings,
  ...dashboard,
  ...budgets,
  ...expenses,
  ...pdf,
  ...bluetooth,
  ...footer,
  ...envelope,
  ...transition,
  ...home,
  // Ajoutez d’autres imports ou objets ici si d’autres sections apparaissent
};

export default frTranslations;
