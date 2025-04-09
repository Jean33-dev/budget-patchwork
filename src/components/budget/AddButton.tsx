
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export const AddButton = ({ onClick, label }: AddButtonProps) => {
  return (
    <div className="flex justify-center mb-4">
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full flex justify-center items-center py-2 border rounded"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        {label}
      </Button>
    </div>
  );
};
