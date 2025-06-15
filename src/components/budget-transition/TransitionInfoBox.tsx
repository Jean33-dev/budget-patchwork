
import React from "react";
import { CalendarDays, ArrowRight, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/context/ThemeContext";

export const TransitionInfoBox = () => {
  const { t } = useTheme();
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="h-5 w-5" />
          <h2 className="font-medium">{t("transition.header")}</h2>
        </div>
        
        <p className="text-sm mb-3">
          {t("transition.description")}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-background p-3 rounded-md border">
            <h3 className="font-medium mb-1">{t("transition.optionsTitle")}</h3>
            <ul className="space-y-1 list-disc pl-5">
              <li><span className="font-medium">{t("transition.option.reset")}</span> : {t("transition.option.resetDesc")}</li>
              <li><span className="font-medium">{t("transition.option.carry")}</span> : {t("transition.option.carryDesc")}</li>
              <li><span className="font-medium">{t("transition.option.transfer")}</span> : {t("transition.option.transferDesc")}</li>
              <li><span className="font-medium">{t("transition.option.multiTransfer")}</span> : {t("transition.option.multiTransferDesc")}</li>
            </ul>
          </div>
          
          <div className="bg-background p-3 rounded-md border">
            <h3 className="font-medium mb-1">{t("transition.consequencesTitle")}</h3>
            <ul className="space-y-1 list-disc pl-5">
              <li>{t("transition.consequence.one")}</li>
              <li>{t("transition.consequence.two")}</li>
              <li>{t("transition.consequence.three")}</li>
              <li>{t("transition.consequence.four")}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm">
          {t("transition.warning")}
        </AlertDescription>
      </Alert>
    </div>
  );
};
