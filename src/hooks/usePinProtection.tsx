
import { useCallback, useState } from "react";

const PIN_KEY = "app_user_pin";
const PIN_LOCKED_KEY = "app_user_locked";

export function hasPin(): boolean {
  return !!localStorage.getItem(PIN_KEY);
}

export function verifyPin(input: string): boolean {
  return input === localStorage.getItem(PIN_KEY);
}

export function setPin(pin: string) {
  localStorage.setItem(PIN_KEY, pin);
  localStorage.removeItem(PIN_LOCKED_KEY);
}

export function clearPin() {
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(PIN_LOCKED_KEY);
}

export function lockApp() {
  localStorage.setItem(PIN_LOCKED_KEY, "1");
}

export function unlockApp() {
  localStorage.removeItem(PIN_LOCKED_KEY);
}

export function isLocked(): boolean {
  return !!localStorage.getItem(PIN_LOCKED_KEY);
}

/**
 * Hook centralisé pour gérer le déverrouillage PIN
 */
export function usePinProtection() {
  const [locked, setLocked] = useState(() => hasPin() && isLocked());

  const unlock = useCallback(() => {
    unlockApp();
    setLocked(false);
  }, []);

  const lock = useCallback(() => {
    lockApp();
    setLocked(true);
  }, []);

  return {
    locked,
    hasPin: hasPin(),
    unlock,
    lock,
    setPin,
    clearPin,
    verifyPin,
  };
}
