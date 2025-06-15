
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudgets } from "@/hooks/useBudgets";
import { useTheme } from "@/context/ThemeContext";

interface ExpenseReceiveDialogProps {
  onReceiveComplete?: () => void;
}

export const ExpenseReceiveDialog = ({ onReceiveComplete }: ExpenseReceiveDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const { budgets, dashboardId } = useBudgets();
  const { t } = useTheme();

  const {
    isScanning,
    devices,
    selectedDevice,
    isConnected,
    isReceivingData,
    receivedData,
    bluetoothAvailable,
    isNativePlatform,
    startScan,
    connectToDevice,
    disconnectFromDevice,
    receiveExpense,
    importReceivedExpense
  } = useBluetoothSharing();

  // Start scan when dialog opens
  useEffect(() => {
    if (isOpen && !selectedDevice && isNativePlatform) {
      startScan();
    }
  }, [isOpen, selectedDevice, startScan, isNativePlatform]);

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
          <span>{t("expenses.receive")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("expenses.receiveExpenseTitle")}</DialogTitle>
          <DialogDescription>
            {t("expenses.receiveExpenseDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {receivedData ? (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">{t("expenses.receiveDataTitle")}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("expenses.receiveFieldTitle")}</span>
                    <span className="font-medium">{receivedData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("expenses.receiveFieldAmount")}</span>
                    <span className="font-medium">{receivedData.amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("expenses.receiveFieldDate")}</span>
                    <span className="font-medium">{receivedData.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("expenses.selectBudget")}</label>
                <Select
                  value={selectedBudgetId}
                  onValueChange={setSelectedBudgetId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("expenses.selectBudgetPlaceholder")} />
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
                {t("expenses.importExpense")}
              </Button>
            </div>
          ) : selectedDevice && isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{t("expenses.connectedTo")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDevice.name || t("expenses.unnamedDevice")}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50">{t("expenses.connected")}</Badge>
              </div>
              
              <Button
                onClick={receiveExpense}
                disabled={isReceivingData}
                className="w-full"
              >
                {isReceivingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("expenses.receiving")}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {t("expenses.receiveData")}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={disconnectFromDevice}
                className="w-full"
              >
                {t("expenses.disconnect")}
              </Button>
            </div>
          ) : (
            <BluetoothDeviceList
              devices={devices}
              onSelectDevice={connectToDevice}
              onScan={startScan}
              isScanning={isScanning}
              bluetoothAvailable={bluetoothAvailable}
              isNativePlatform={isNativePlatform}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
