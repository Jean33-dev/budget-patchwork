
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { BluetoothDeviceList } from "./BluetoothDeviceList";
import { useBluetoothSharing } from "@/hooks/useBluetoothSharing";
import { Expense } from "@/services/database/models/expense";
import { ExpenseShareData } from "@/services/bluetooth/bluetooth-service";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExpenseShareButton } from "./ExpenseShareButton";

interface ExpenseShareDialogProps {
  expense: Expense;
  onShareComplete?: () => void;
}

export const ExpenseShareDialog = ({ 
  expense,
  onShareComplete 
}: ExpenseShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isScanning,
    devices,
    selectedDevice,
    isConnected,
    isSendingData,
    startScan,
    connectToDevice,
    disconnectFromDevice,
    sendExpense
  } = useBluetoothSharing();

  // Disconnection on dialog close
  useEffect(() => {
    if (!isOpen && selectedDevice) {
      disconnectFromDevice();
    }
  }, [isOpen, selectedDevice, disconnectFromDevice]);

  // Format expense data for sharing
  const handleShareExpense = async () => {
    if (!selectedDevice || !isConnected) return;

    const expenseData: ExpenseShareData = {
      title: expense.title,
      amount: expense.budget,
      date: expense.date
    };

    const success = await sendExpense(expenseData);
    if (success && onShareComplete) {
      setTimeout(() => {
        setIsOpen(false);
        onShareComplete();
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ExpenseShareButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager la dépense</DialogTitle>
          <DialogDescription>
            Partagez cette dépense avec un autre appareil via Bluetooth
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-md bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">Détails de la dépense</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titre</span>
                <span className="font-medium">{expense.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-medium">{expense.budget.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{expense.date}</span>
              </div>
            </div>
          </div>

          {selectedDevice && isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Connecté à</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDevice.name || "Appareil sans nom"}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50">Connecté</Badge>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleShareExpense}
                  disabled={isSendingData}
                  className="w-full"
                >
                  {isSendingData ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer les données
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={disconnectFromDevice}
                  disabled={isSendingData}
                >
                  Déconnecter
                </Button>
              </div>
            </div>
          ) : (
            <>
              <BluetoothDeviceList
                devices={devices}
                onSelectDevice={connectToDevice}
                onScan={startScan}
                isScanning={isScanning}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
