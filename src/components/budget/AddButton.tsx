
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export const AddButton = ({ onClick, label }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="w-full justify-start py-6 border-b rounded-none hover:bg-slate-50"
    >
      <PlusCircle className="h-5 w-5 mr-2" />
      {label}
    </Button>
  );
};
