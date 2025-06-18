
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Plus, Edit, Trash2, Eye, Calculator, PieChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Help = () => {
  const navigate = useNavigate();

  const helpSections = [
    {
      title: "Démarrage rapide",
      icon: <HelpCircle className="h-5 w-5" />,
      content: [
        "Créez votre premier tableau de bord pour organiser vos finances",
        "Ajoutez vos revenus mensuels pour définir votre budget global",
        "Créez des enveloppes budgétaires pour chaque catégorie de dépenses",
        "Enregistrez vos dépenses et suivez vos budgets en temps réel"
      ]
    },
    {
      title: "Gestion des budgets",
      icon: <Calculator className="h-5 w-5" />,
      content: [
        "Cliquez sur le bouton '+' pour créer un nouveau budget",
        "Définissez un nom et un montant pour chaque enveloppe budgétaire",
        "Modifiez vos budgets en cliquant sur l'enveloppe correspondante",
        "Surveillez le montant restant affiché en haut de la page"
      ]
    },
    {
      title: "Suivi des dépenses",
      icon: <FileText className="h-5 w-5" />,
      content: [
        "Ajoutez vos dépenses en les associant à un budget spécifique",
        "Visualisez toutes vos dépenses dans la section dédiée",
        "Modifiez ou supprimez des dépenses existantes",
        "Consultez le détail des dépenses pour chaque budget"
      ]
    },
    {
      title: "Revenus et catégories",
      icon: <PieChart className="h-5 w-5" />,
      content: [
        "Enregistrez vos différentes sources de revenus",
        "Organisez vos budgets par catégories pour une meilleure vue d'ensemble",
        "Utilisez les revenus récurrents pour automatiser vos entrées",
        "Suivez l'évolution de vos finances mois par mois"
      ]
    }
  ];

  const quickActions = [
    {
      title: "Ajouter un budget",
      description: "Créer une nouvelle enveloppe budgétaire",
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate('/dashboard/budgets')
    },
    {
      title: "Voir les dépenses",
      description: "Consulter toutes vos dépenses",
      icon: <Eye className="h-4 w-4" />,
      action: () => navigate('/dashboard/expenses')
    },
    {
      title: "Gérer les revenus",
      description: "Ajouter ou modifier vos revenus",
      icon: <Edit className="h-4 w-4" />,
      action: () => navigate('/dashboard/income')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Centre d'aide</h1>
            <p className="text-muted-foreground mt-1">
              Apprenez à utiliser votre application de gestion budgétaire
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={action.action}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {action.icon}
                    {action.title}
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {action.description}
                  </p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Sections */}
        <div className="space-y-6">
          {helpSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Tips and Tricks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Conseils et astuces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium mb-2">💡 Planification budgétaire</h4>
              <p className="text-sm text-muted-foreground">
                Commencez par définir vos revenus, puis répartissez-les en enveloppes selon vos priorités : 
                logement, alimentation, transport, épargne, loisirs.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-medium mb-2">📊 Suivi régulier</h4>
              <p className="text-sm text-muted-foreground">
                Consultez vos budgets régulièrement et ajustez-les selon vos besoins. 
                L'application vous montre en temps réel combien il vous reste dans chaque enveloppe.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <h4 className="font-medium mb-2">🎯 Objectifs financiers</h4>
              <p className="text-sm text-muted-foreground">
                Utilisez les enveloppes pour épargner en vue d'objectifs spécifiques : 
                vacances, urgences, gros achats. Cela vous aide à rester motivé.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Vous avez encore des questions ?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 mx-auto"
          >
            <Edit className="h-4 w-4" />
            Accéder aux paramètres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;
