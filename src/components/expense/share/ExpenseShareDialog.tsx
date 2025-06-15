
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { BluetoothDeviceList } from "./BluetoothDeviceList";
import { useBluetoothSharing } from "@/hooks/useBluetoothSharing";
import { Expense } from "@/services/database/models/expense";
import { ExpenseShareData } from "@/services/bluetooth/bluetooth-service";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";

interface ExpenseShareDialogProps {
  expense: Expense;
  onShareComplete?: () => void;
}

export const ExpenseShareDialog = ({ 
  expense,
  onShareComplete 
}: ExpenseShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    isScanning,
    devices,
    selectedDevice,
    isConnected,
    isSendingData,
    bluetoothAvailable,
    isNativePlatform,
    startScan,
    connectToDevice,
    disconnectFromDevice,
    sendExpense
  } = useBluetoothSharing();

  const { t } = useTheme();

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

  // Handle dialog close
  useEffect(() => {
    if (!isOpen && onShareComplete) {
      onShareComplete();
    }
  }, [isOpen, onShareComplete]);

  // Format expense data for sharing
  const handleShareExpense = async () => {
    if (!selectedDevice || !isConnected) return;

    const expenseData: ExpenseShareData = {
      title: expense.title,
      amount: expense.budget,
      date: expense.date || new Date().toISOString().split('T')[0]
    };

    const success = await sendExpense(expenseData);
    if (success && onShareComplete) {
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("bluetooth.shareExpenseTitle")}</DialogTitle>
          <DialogDescription>
            {t("bluetooth.shareExpenseDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-md bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">{t("bluetooth.detailsTitle")}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("bluetooth.detailsFieldTitle")}</span>
                <span className="font-medium">{expense.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("bluetooth.detailsFieldAmount")}</span>
                <span className="font-medium">{expense.budget.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("bluetooth.detailsFieldDate")}</span>
                <span className="font-medium">{expense.date || t("bluetooth.unknownDate")}</span>
              </div>
            </div>
          </div>

          {selectedDevice && isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{t("bluetooth.connectedTo")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDevice.name || t("bluetooth.unnamedDevice")}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50">{t("bluetooth.connected")}</Badge>
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
                      {t("bluetooth.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("bluetooth.sendData")}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={disconnectFromDevice}
                  disabled={isSendingData}
                >
                  {t("bluetooth.disconnect")}
                </Button>
              </div>
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
