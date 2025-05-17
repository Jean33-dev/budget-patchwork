
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { toast } from "@/components/ui/use-toast";

// Structure pour les données de dépense à partager
export interface ExpenseShareData {
  title: string;
  amount: number;
  date: string;
}

// Service UUID pour notre application
const SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb'; // UUID personnalisé
const CHARACTERISTIC_UUID = '00001235-0000-1000-8000-00805f9b34fb'; // UUID personnalisé

export class BluetoothService {
  private static instance: BluetoothService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await BleClient.initialize();
        this.isInitialized = true;
        console.log('Bluetooth initialized successfully');
      }
      return true;
    } catch (error) {
      console.error('Error initializing Bluetooth:', error);
      toast({
        variant: "destructive",
        title: "Erreur Bluetooth",
        description: "Impossible d'initialiser Bluetooth"
      });
      return false;
    }
  }

  async scanForDevices(): Promise<BleDevice[]> {
    try {
      if (!await this.initialize()) return [];

      const devices: BleDevice[] = [];
      await BleClient.requestLEScan(
        {
          services: [SERVICE_UUID],
        },
        (result) => {
          // Ajouter l'appareil à la liste s'il n'existe pas déjà
          if (!devices.find(d => d.deviceId === result.device.deviceId)) {
            devices.push(result.device);
          }
        }
      );

      // Scanner pendant 5 secondes
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('Scanning stopped');
      }, 5000);

      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      toast({
        variant: "destructive",
        title: "Erreur de recherche",
        description: "Impossible de rechercher des appareils Bluetooth"
      });
      return [];
    }
  }

  async connect(deviceId: string): Promise<boolean> {
    try {
      if (!await this.initialize()) return false;
      
      await BleClient.connect(deviceId);
      console.log('Connected to device:', deviceId);
      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de se connecter à l'appareil"
      });
      return false;
    }
  }

  async disconnect(deviceId: string): Promise<void> {
    try {
      if (!this.isInitialized) return;
      await BleClient.disconnect(deviceId);
      console.log('Disconnected from device:', deviceId);
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }
  }

  async sendExpenseData(deviceId: string, expenseData: ExpenseShareData): Promise<boolean> {
    try {
      if (!await this.initialize()) return false;
      
      // Convertir les données en JSON puis en ArrayBuffer
      const jsonString = JSON.stringify(expenseData);
      const encoder = new TextEncoder();
      const data = encoder.encode(jsonString);
      
      // Créer une DataView à partir de l'ArrayBuffer pour être compatible avec l'API BleClient
      const buffer = data.buffer;
      const dataView = new DataView(buffer);
      
      await BleClient.write(
        deviceId,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        dataView
      );
      
      console.log('Expense data sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending expense data:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer les données de dépense"
      });
      return false;
    }
  }

  async receiveExpenseData(deviceId: string): Promise<ExpenseShareData | null> {
    try {
      if (!await this.initialize()) return null;
      
      const result = await BleClient.read(
        deviceId,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );
      
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(result);
      const expenseData: ExpenseShareData = JSON.parse(jsonString);
      
      console.log('Expense data received:', expenseData);
      return expenseData;
    } catch (error) {
      console.error('Error receiving expense data:', error);
      toast({
        variant: "destructive",
        title: "Erreur de réception",
        description: "Impossible de recevoir les données de dépense"
      });
      return null;
    }
  }
}

export const bluetoothService = BluetoothService.getInstance();
