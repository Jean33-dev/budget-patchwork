
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HomeFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Button>
      </div>
    </footer>
  );
};
