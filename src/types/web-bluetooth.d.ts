
// Declaration file for Web Bluetooth API
interface Navigator {
  bluetooth?: {
    getAvailability: () => Promise<boolean>;
    requestDevice: (options: any) => Promise<BluetoothDevice>;
  }
}

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: {
    connect: () => Promise<BluetoothRemoteGATTServer>;
  };
}

interface BluetoothRemoteGATTServer {
  getPrimaryService: (service: string) => Promise<BluetoothRemoteGATTService>;
  connected: boolean;
  disconnect: () => void;
}

interface BluetoothRemoteGATTService {
  getCharacteristic: (characteristic: string) => Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  writeValue: (value: BufferSource) => Promise<void>;
  readValue: () => Promise<DataView>;
}

