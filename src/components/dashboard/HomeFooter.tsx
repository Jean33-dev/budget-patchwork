import { Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/shared/AdBanner";

export const HomeFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t py-3 px-4 z-50 shadow-lg">
      <AdBanner />
      <div className="max-w-screen-xl mx-auto flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
          onClick={() => navigate("/help")}
        >
          <HelpCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Aide</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
          <span className="hidden sm:inline">Paramètres</span>
        </Button>
      </div>
    </footer>
  );
};
