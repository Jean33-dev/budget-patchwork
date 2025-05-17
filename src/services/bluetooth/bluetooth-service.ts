
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { toast } from "@/hooks/use-toast";

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
  private isBrowserEnv = typeof window !== 'undefined' && 
                         typeof navigator !== 'undefined' &&
                         !('capacitor' in window);

  private constructor() {}

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Vérifier si nous sommes dans un navigateur sans l'API Bluetooth
      if (this.isBrowserEnv) {
        console.log('Detected browser environment. Web Bluetooth may not be available.');
        
        // Vérifier si l'API Web Bluetooth est disponible
        if (!navigator.bluetooth) {
          console.error('Web Bluetooth API not available in this browser');
          return false;
        }
      }
      
      if (!this.isInitialized) {
        console.log('Initializing Bluetooth...');
        await BleClient.initialize();
        this.isInitialized = true;
        console.log('Bluetooth initialized successfully');
      }
      return true;
    } catch (error) {
      console.error('Error initializing Bluetooth:', error);
      
      // Message d'erreur plus utilisateur-friendly
      let errorMessage = "Impossible d'initialiser Bluetooth.";
      
      // Message spécifique pour navigateur web
      if (this.isBrowserEnv) {
        errorMessage += " Cette fonctionnalité nécessite l'app mobile pour fonctionner correctement.";
      } else {
        errorMessage += " Vérifiez que le Bluetooth est activé et que les permissions sont accordées.";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur Bluetooth",
        description: errorMessage
      });
      
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // Si nous sommes dans un navigateur sans support Bluetooth, retourner false
      if (this.isBrowserEnv && !navigator.bluetooth) {
        return false;
      }
      
      // Vérifier si le Bluetooth est disponible et activé
      const bluetoothIsAvailable = await BleClient.isEnabled();
      if (!bluetoothIsAvailable) {
        console.log('Bluetooth is not enabled, requesting to enable it');
        toast({
          title: "Bluetooth désactivé",
          description: "Veuillez activer le Bluetooth sur votre appareil"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      toast({
        variant: "destructive",
        title: "Erreur Bluetooth",
        description: "Impossible de vérifier l'état du Bluetooth"
      });
      return false;
    }
  }

  async scanForDevices(): Promise<BleDevice[]> {
    try {
      if (!await this.initialize()) return [];
      if (!await this.requestPermissions()) return [];
      
      console.log('Starting BLE scan...');
      const devices: BleDevice[] = [];
      
      await BleClient.requestLEScan(
        { 
          // Ne pas filtrer par service UUID pour trouver plus d'appareils
          // services: [SERVICE_UUID],
        },
        (result) => {
          console.log('Found device:', result.device);
          // Ajouter l'appareil à la liste s'il n'existe pas déjà
          if (!devices.find(d => d.deviceId === result.device.deviceId)) {
            devices.push(result.device);
          }
        }
      );

      // Scanner pendant 5 secondes
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('Scanning stopped, found', devices.length, 'devices');
      }, 5000);

      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      toast({
        variant: "destructive",
        title: "Erreur de recherche",
        description: "Impossible de rechercher des appareils Bluetooth. Vérifiez les permissions."
      });
      return [];
    }
  }

  async connect(deviceId: string): Promise<boolean> {
    try {
      if (!await this.initialize()) return false;
      if (!await this.requestPermissions()) return false;
      
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
      if (!await this.requestPermissions()) return false;
      
      // Convertir les données en JSON puis en ArrayBuffer
      const jsonString = JSON.stringify(expenseData);
      const encoder = new TextEncoder();
      const dataArray = encoder.encode(jsonString);
      
      // Correction: créer un DataView à partir de l'ArrayBuffer pour être compatible avec l'API BleClient
      const dataView = new DataView(dataArray.buffer);
      
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
      if (!await this.requestPermissions()) return null;
      
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
