
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LineChart, ArrowLeft } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDashboards } from "@/hooks/useDashboards";
import { Textarea } from "@/components/ui/textarea";

// Définir le schéma de validation
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDashboard } = useDashboards();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    
    try {
      // Créer le nouveau tableau de bord avec notre hook
      const newDashboard = addDashboard({
        title: data.title,
        description: data.description || "",
      });
      
      if (newDashboard) {
        // Notifier l'utilisateur que le tableau de bord a été créé
        toast({
          title: "Tableau de bord créé",
          description: `Votre tableau de bord "${data.title}" a été créé avec succès.`,
        });
        
        // Rediriger l'utilisateur vers la page d'accueil
        navigate("/");
      } else {
        throw new Error("Échec de la création du tableau de bord");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du tableau de bord.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>
      
      <h1 className="text-4xl font-bold mb-8">Créer un nouveau tableau de bord</h1>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-6 w-6" />
            Nouveau Tableau de Bord
          </CardTitle>
          <CardDescription>
            Personnalisez les informations de votre nouveau tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon tableau de bord" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optionnelle)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez l'objectif de ce tableau de bord" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Création en cours..." : "Créer le tableau de bord"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDashboard;
