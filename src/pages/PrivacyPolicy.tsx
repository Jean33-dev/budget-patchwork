import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Politique de Confidentialité</CardTitle>
            <CardDescription>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p className="text-muted-foreground">
                OptiBudget ("nous", "notre" ou "nos") s'engage à protéger votre vie privée. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Données Collectées</h2>
              <p className="text-muted-foreground mb-2">
                OptiBudget collecte et stocke les données suivantes localement sur votre appareil :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Budgets et enveloppes budgétaires</li>
                <li>Revenus et dépenses</li>
                <li>Catégories personnalisées</li>
                <li>Préférences de l'application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Stockage des Données</h2>
              <p className="text-muted-foreground">
                Toutes vos données financières sont stockées localement sur votre appareil via SQLite. 
                Nous ne transmettons, ne stockons ni ne sauvegardons vos données sur des serveurs externes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Publicité</h2>
              <p className="text-muted-foreground mb-2">
                OptiBudget utilise Google AdMob pour afficher des publicités. AdMob peut collecter :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Identifiant publicitaire de votre appareil</li>
                <li>Données d'utilisation anonymes</li>
                <li>Données de localisation approximative (si autorisé)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Pour plus d'informations, consultez la{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  politique de confidentialité de Google
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Partage de Données via Bluetooth</h2>
              <p className="text-muted-foreground">
                OptiBudget utilise le Bluetooth pour partager des dépenses entre appareils. 
                Cette fonctionnalité nécessite votre autorisation explicite et ne partage que les données que vous choisissez d'envoyer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Permissions Requises</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Bluetooth :</strong> Pour le partage de dépenses entre appareils</li>
                <li><strong>Localisation :</strong> Requise par le système pour la fonctionnalité Bluetooth</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Sécurité</h2>
              <p className="text-muted-foreground">
                Vos données sont stockées localement sur votre appareil et protégées par les mécanismes de sécurité 
                de votre système d'exploitation (chiffrement au repos, sandboxing des applications).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Vos Droits</h2>
              <p className="text-muted-foreground">
                Vous avez le contrôle total sur vos données :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Suppression : Supprimez l'application pour effacer toutes vos données</li>
                <li>Export : Exportez vos données au format PDF via la fonctionnalité d'export</li>
                <li>Accès : Consultez toutes vos données directement dans l'application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
              <p className="text-muted-foreground">
                Nous pouvons mettre à jour cette politique de confidentialité. Les modifications seront 
                publiées dans cette page avec une date de mise à jour actualisée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité, contactez-nous via 
                la section Aide de l'application.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
