
import settings from './settings';
import dashboard from './dashboard';
import home from './home';
import budgets from './budgets';
import expenses from './expenses';
import footer from './footer';
import pdf from './pdf';
import bluetooth from './bluetooth';
import envelope from './envelope';
import transition from './transition';
import income from './income';
import categories from './categories';

const frTranslations: Record<string, string> = {
  ...settings,
  ...dashboard,
  ...home,
  ...budgets,
  ...expenses,
  ...footer,
  ...pdf,
  ...bluetooth,
  ...envelope,
  ...transition,
  ...income,
  ...categories,
  "charts.title.budgets": "Répartition des budgets",
  "charts.title.categories": "Répartition par catégories",
  "charts.unallocatedBudget": "Budget non alloué",
};

export default frTranslations;
