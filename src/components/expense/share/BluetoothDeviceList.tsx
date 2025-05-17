
import { BleDevice } from "@capacitor-community/bluetooth-le";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, RefreshCw, AlertTriangle, Smartphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BluetoothDeviceListProps {
  devices: BleDevice[];
  onSelectDevice: (device: BleDevice) => void;
  onScan: () => void;
  isScanning: boolean;
  bluetoothAvailable?: boolean | null;
  isNativePlatform?: boolean;
}

export const BluetoothDeviceList = ({
  devices,
  onSelectDevice,
  onScan,
  isScanning,
  bluetoothAvailable = null,
  isNativePlatform = false
}: BluetoothDeviceListProps) => {
  // Si nous ne sommes pas sur une plateforme native (navigateur web)
  if (!isNativePlatform) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bluetooth className="mr-2 h-5 w-5" />
              Bluetooth
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Smartphone className="h-10 w-10 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">App mobile requise</p>
            <p className="text-sm mt-1 mb-3">
              Le partage Bluetooth n'est disponible que sur l'application mobile.
              Veuillez installer l'application sur votre appareil mobile pour utiliser cette fonctionnalité.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bluetoothAvailable === false) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bluetooth className="mr-2 h-5 w-5" />
              Bluetooth
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">Bluetooth non disponible</p>
            <p className="text-sm mt-1 mb-3">Veuillez activer le Bluetooth et vérifier les permissions de l'application</p>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onScan}
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bluetooth className="mr-2 h-5 w-5" />
            Appareils disponibles
          </CardTitle>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onScan}
            disabled={isScanning}
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isScanning ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Aucun appareil trouvé</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={onScan}
            >
              Rechercher
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {devices.map((device) => (
              <Button
                key={device.deviceId}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => onSelectDevice(device)}
              >
                <div>
                  <div className="font-medium">{device.name || "Appareil sans nom"}</div>
                  <div className="text-xs text-muted-foreground truncate">{device.deviceId}</div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
