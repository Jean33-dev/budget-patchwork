
import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { usePinProtection } from "@/hooks/usePinProtection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const PINSetup: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const { setPin: savePin } = usePinProtection();

  const handleNext = () => {
    if (pin.length !== 4) {
      setError("Le code doit contenir 4 chiffres.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleConfirm = () => {
    if (pin !== confirmPin) {
      setError("Les codes ne correspondent pas.");
      return;
    }
    savePin(pin);
    setError("");
    onSuccess();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-xs text-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {step === 1 ? "Créez votre code PIN" : "Confirmez le code PIN"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">Protégez l’accès à votre application.</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              step === 1 ? handleNext() : handleConfirm();
            }}
            className="space-y-2"
          >
            <InputOTP
              maxLength={4}
              type="number"
              value={step === 1 ? pin : confirmPin}
              onChange={step === 1 ? setPin : setConfirmPin}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3].map((idx) => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
            <Button type="submit" className="w-full mt-2">
              {step === 1 ? "Continuer" : "Valider"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
