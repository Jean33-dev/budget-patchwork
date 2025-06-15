
import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { usePinProtection } from "@/hooks/usePinProtection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export const PINUnlock: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { verifyPin, unlock } = usePinProtection();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      unlock();
      onSuccess();
    } else {
      setError("Code PIN incorrect.");
      setPin("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-xs text-center">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <Lock className="mx-auto h-8 w-8 text-primary" />
            <CardTitle className="text-lg font-semibold">
              Entrez votre code PIN
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-2">
            <InputOTP
              maxLength={4}
              type="number"
              value={pin}
              onChange={setPin}
              containerClassName="justify-center"
              autoFocus
            >
              <InputOTPGroup>
                {[0, 1, 2, 3].map((idx) => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
            <Button type="submit" className="w-full mt-2">
              Déverrouiller
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
