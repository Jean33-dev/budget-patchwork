
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
import { BluetoothSearching, Loader2, Download } from "lucide-react";
import { BluetoothDeviceList } from "./BluetoothDeviceList";
import { useBluetoothSharing } from "@/hooks/useBluetoothSharing";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Budget } from "@/hooks/useBudgets";
import { useBudgets } from "@/hooks/useBudgets";

interface ExpenseReceiveDialogProps {
  onReceiveComplete?: () => void;
}

export const ExpenseReceiveDialog = ({ onReceiveComplete }: ExpenseReceiveDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const { budgets, dashboardId } = useBudgets();
  
  const {
    isScanning,
    devices,
    selectedDevice,
    isConnected,
    isReceivingData,
    receivedData,
    startScan,
    connectToDevice,
    disconnectFromDevice,
    receiveExpense,
    importReceivedExpense
  } = useBluetoothSharing();

  // Disconnection on dialog close
  useEffect(() => {
    if (!isOpen && selectedDevice) {
      disconnectFromDevice();
    }
  }, [isOpen, selectedDevice, disconnectFromDevice]);

  // Set first budget as default when budgets load
  useEffect(() => {
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id);
    }
  }, [budgets, selectedBudgetId]);

  const handleImportExpense = async () => {
    if (!receivedData || !selectedBudgetId || !dashboardId) return;
    
    const success = await importReceivedExpense(selectedBudgetId, dashboardId);
    
    if (success && onReceiveComplete) {
      setTimeout(() => {
        setIsOpen(false);
        onReceiveComplete();
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5">
          <BluetoothSearching size={16} />
          <span>Recevoir</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recevoir une dépense</DialogTitle>
          <DialogDescription>
            Connectez-vous à un appareil pour recevoir des données de dépense
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {receivedData ? (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">Données reçues</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titre</span>
                    <span className="font-medium">{receivedData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant</span>
                    <span className="font-medium">{receivedData.amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{receivedData.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sélectionner un budget</label>
                <Select
                  value={selectedBudgetId}
                  onValueChange={setSelectedBudgetId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget.id} value={budget.id}>
                        {budget.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full"
                onClick={handleImportExpense}
                disabled={!selectedBudgetId}
              >
                <Download className="mr-2 h-4 w-4" />
                Importer la dépense
              </Button>
            </div>
          ) : selectedDevice && isConnected ? (
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
              
              <Button
                onClick={receiveExpense}
                disabled={isReceivingData}
                className="w-full"
              >
                {isReceivingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réception en cours...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Recevoir les données
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={disconnectFromDevice}
                className="w-full"
              >
                Déconnecter
              </Button>
            </div>
          ) : (
            <BluetoothDeviceList
              devices={devices}
              onSelectDevice={connectToDevice}
              onScan={startScan}
              isScanning={isScanning}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
