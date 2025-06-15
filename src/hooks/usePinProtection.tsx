
import { useCallback, useState, useEffect } from "react";
import { DatabaseManager } from "@/services/database/database-manager";

const dbm = new DatabaseManager();

export function usePinProtection() {
  const [locked, setLocked] = useState<boolean | null>(null);
  const [hasPin, setHasPin] = useState<boolean>(false);

  // Charge l'état du PIN et du verrouillage depuis la BDD asynchrone
  const refreshState = useCallback(async () => {
    await dbm.init();
    const [pinSet, lockedStatus] = await Promise.all([
      dbm.hasPin(),
      dbm.isLocked()
    ]);
    setHasPin(pinSet);
    setLocked(pinSet && lockedStatus);
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // Toutes les actions sont asynchrones !
  const unlock = useCallback(async () => {
    await dbm.unlockApp();
    await refreshState();
  }, [refreshState]);

  const lock = useCallback(async () => {
    await dbm.lockApp();
    await refreshState();
  }, [refreshState]);

  const setPin = useCallback(async (pin: string) => {
    await dbm.setPin(pin);
    await refreshState();
  }, [refreshState]);

  const clearPin = useCallback(async () => {
    await dbm.clearPin();
    await refreshState();
  }, [refreshState]);

  const verifyPin = useCallback(async (input: string) => {
    return dbm.verifyPin(input);
  }, []);

  return {
    locked,
    hasPin,
    unlock,
    lock,
    setPin,
    clearPin,
    verifyPin,
    refreshState,
  };
}
