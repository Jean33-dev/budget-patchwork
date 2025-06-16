
import settingsTranslations from "./settings";
import dashboardTranslations from "./dashboard";
import homeTranslations from "./home";
import budgetsTranslations from "./budgets";
import expensesTranslations from "./expenses";
import footerTranslations from "./footer";
import pdfTranslations from "./pdf";
import bluetoothTranslations from "./bluetooth";
import envelopeTranslations from "./envelope";
import transitionTranslations from "./transition";
import incomeTranslations from "./income";
import categoriesTranslations from "./categories";

const generalTranslations = {
  "index.title": "Panel de Presupuesto",
  "index.salary": "Salario",
  "index.freelance": "Freelance",
  "index.rent": "Alquiler",
  "index.groceries": "Compras",
  "index.leisure": "Ocio",
  "index.housing": "Vivienda",
  "index.food": "Alimentación",
  "index.success": "Éxito",
  "index.toast.income": "Nuevo sobre de ingreso creado",
  "index.toast.expense": "Nuevo sobre de gasto creado",
  "index.budget": "Presupuesto",
  "index.spent": "Gastado",
  "index.category": "Categoría",
  "overview.totalIncome": "Ingresos Totales",
  "overview.totalExpenses": "Gastos Totales",
  "overview.balance": "Saldo",
  "charts.title.budgets": "Distribución de presupuestos",
  "charts.title.categories": "Distribución por categorías",
  "charts.unallocatedBudget": "Presupuesto no asignado",
  "stats.remainingIncome": "Ingresos restantes por repartir",
  "stats.remainingBudget": "Presupuesto restante",
  "stats.overviewSubtitle": "Resumen de sus finanzas",
};

const esTranslations = {
  ...settingsTranslations,
  ...dashboardTranslations,
  ...homeTranslations,
  ...budgetsTranslations,
  ...expensesTranslations,
  ...footerTranslations,
  ...pdfTranslations,
  ...bluetoothTranslations,
  ...envelopeTranslations,
  ...transitionTranslations,
  ...incomeTranslations,
  ...categoriesTranslations,
  ...generalTranslations,
};

export default esTranslations;
