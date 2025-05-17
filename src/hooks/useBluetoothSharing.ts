
import { useState, useCallback } from 'react';
import { bluetoothService, ExpenseShareData } from '@/services/bluetooth/bluetooth-service';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/services/database/models/expense';
import { expenseOperations } from '@/utils/expense-operations';

export const useBluetoothSharing = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BleDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);
  const [receivedData, setReceivedData] = useState<ExpenseShareData | null>(null);
  const { toast } = useToast();

  const startScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const discoveredDevices = await bluetoothService.scanForDevices();
      setDevices(discoveredDevices);
      toast({
        title: "Recherche terminée",
        description: `${discoveredDevices.length} appareils trouvés`
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const connectToDevice = useCallback(async (device: BleDevice) => {
    const success = await bluetoothService.connect(device.deviceId);
    if (success) {
      setSelectedDevice(device);
      setIsConnected(true);
      toast({
        title: "Connecté",
        description: `Connecté à ${device.name || device.deviceId}`
      });
    }
    return success;
  }, [toast]);

  const disconnectFromDevice = useCallback(async () => {
    if (selectedDevice) {
      await bluetoothService.disconnect(selectedDevice.deviceId);
      setSelectedDevice(null);
      setIsConnected(false);
      toast({
        title: "Déconnecté",
        description: "Déconnecté de l'appareil"
      });
    }
  }, [selectedDevice, toast]);

  const sendExpense = useCallback(async (expense: ExpenseShareData) => {
    if (!selectedDevice || !isConnected) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun appareil connecté"
      });
      return false;
    }

    setIsSendingData(true);
    try {
      const success = await bluetoothService.sendExpenseData(selectedDevice.deviceId, expense);
      if (success) {
        toast({
          title: "Envoi réussi",
          description: `Dépense "${expense.title}" envoyée`
        });
      }
      return success;
    } finally {
      setIsSendingData(false);
    }
  }, [selectedDevice, isConnected, toast]);

  const receiveExpense = useCallback(async () => {
    if (!selectedDevice || !isConnected) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun appareil connecté"
      });
      return null;
    }

    setIsReceivingData(true);
    try {
      const data = await bluetoothService.receiveExpenseData(selectedDevice.deviceId);
      if (data) {
        setReceivedData(data);
        toast({
          title: "Données reçues",
          description: `Dépense "${data.title}" reçue`
        });
      }
      return data;
    } finally {
      setIsReceivingData(false);
    }
  }, [selectedDevice, isConnected, toast]);

  const importReceivedExpense = useCallback(async (budgetId: string, dashboardId: string) => {
    if (!receivedData) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucune donnée à importer"
      });
      return false;
    }

    try {
      const success = await expenseOperations.addExpense({
        title: receivedData.title,
        budget: receivedData.amount,
        type: "expense",
        linkedBudgetId: budgetId,
        date: receivedData.date,
        dashboardId: dashboardId
      });

      if (success) {
        toast({
          title: "Import réussi",
          description: `Dépense "${receivedData.title}" importée`
        });
        setReceivedData(null);
      }
      return success;
    } catch (error) {
      console.error('Error importing expense:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: "Impossible d'importer la dépense"
      });
      return false;
    }
  }, [receivedData, toast]);

  return {
    isScanning,
    devices,
    selectedDevice,
    isConnected,
    isReceivingData,
    isSendingData,
    receivedData,
    startScan,
    connectToDevice,
    disconnectFromDevice,
    sendExpense,
    receiveExpense,
    importReceivedExpense
  };
};
