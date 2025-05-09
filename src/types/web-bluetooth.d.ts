
// Declaration file for Web Bluetooth API
interface Navigator {
  bluetooth?: {
    getAvailability: () => Promise<boolean>;
    requestDevice: (options: any) => Promise<any>;
  }
}
