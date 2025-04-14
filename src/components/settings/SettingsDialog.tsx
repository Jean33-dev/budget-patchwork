
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings2, Languages, CurrencyIcon, SunMoon } from "lucide-react";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useState } from "react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateCurrency, updateLanguage, updateTheme } = useAppSettings();
  
  // État local pour suivre les changements avant de les appliquer
  const [localSettings, setLocalSettings] = useState({
    currency: settings.currency,
    language: settings.language,
    theme: settings.theme
  });

  // Réinitialiser l'état local quand le dialogue s'ouvre
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalSettings({
        currency: settings.currency,
        language: settings.language,
        theme: settings.theme
      });
    }
    onOpenChange(open);
  };
  
  // Appliquer les changements lors de la soumission
  const handleSubmit = () => {
    updateCurrency(localSettings.currency);
    updateLanguage(localSettings.language);
    updateTheme(localSettings.theme);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Paramètres
          </DialogTitle>
          <DialogDescription>
            Configurez vos préférences d'affichage et de localisation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sélection de la devise */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CurrencyIcon className="h-4 w-4" />
              <h4 className="font-medium">Devise</h4>
            </div>
            <RadioGroup
              value={localSettings.currency}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, currency: value as any }))}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EUR" id="eur" />
                <Label htmlFor="eur">Euro (€)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="usd" />
                <Label htmlFor="usd">Dollar ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="GBP" id="gbp" />
                <Label htmlFor="gbp">Livre (£)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CAD" id="cad" />
                <Label htmlFor="cad">Dollar CAD ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CHF" id="chf" />
                <Label htmlFor="chf">Franc suisse (CHF)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Sélection de la langue */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <h4 className="font-medium">Langue</h4>
            </div>
            <RadioGroup
              value={localSettings.language}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value as any }))}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fr" id="fr" />
                <Label htmlFor="fr">Français</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="es" id="es" />
                <Label htmlFor="es">Español</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="de" id="de" />
                <Label htmlFor="de">Deutsch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="it" id="it" />
                <Label htmlFor="it">Italiano</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Sélection du thème */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SunMoon className="h-4 w-4" />
              <h4 className="font-medium">Thème</h4>
            </div>
            <RadioGroup
              value={localSettings.theme}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, theme: value as any }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Clair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Sombre</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">Système</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
