
// Declaration file for Web Bluetooth API
interface Navigator {
  bluetooth?: {
    getAvailability: () => Promise<boolean>;
    requestDevice: (options: RequestDeviceOptions) => Promise<BluetoothDevice>;
  };
  // Déclaration de l'API Web Share
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: string[];
  acceptAllDevices?: boolean;
}

interface BluetoothRequestDeviceFilter {
  services?: string[];
  name?: string;
  namePrefix?: string;
  manufacturerId?: number;
  serviceDataUUID?: string;
}

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: {
    connect: () => Promise<BluetoothRemoteGATTServer>;
  };
  watchAdvertisements?: () => Promise<void>;
  unwatchAdvertisements?: () => void;
  addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

interface BluetoothRemoteGATTServer {
  getPrimaryService: (service: string) => Promise<BluetoothRemoteGATTService>;
  getPrimaryServices: (service?: string) => Promise<BluetoothRemoteGATTService[]>;
  connected: boolean;
  disconnect: () => void;
  device: BluetoothDevice;
}

interface BluetoothRemoteGATTService {
  getCharacteristic: (characteristic: string) => Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics: (characteristic?: string) => Promise<BluetoothRemoteGATTCharacteristic[]>;
  uuid: string;
}

interface BluetoothRemoteGATTCharacteristic {
  writeValue: (value: BufferSource) => Promise<void>;
  readValue: () => Promise<DataView>;
  startNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>;
  uuid: string;
  properties: {
    broadcast: boolean;
    read: boolean;
    writeWithoutResponse: boolean;
    write: boolean;
    notify: boolean;
    indicate: boolean;
    authenticatedSignedWrites: boolean;
    reliableWrite: boolean;
    writableAuxiliaries: boolean;
  };
}
