
import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { usePinProtection } from "@/hooks/usePinProtection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";

export const PINSetup: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setError("");
    setSuccess(true);
    savePin(pin);
    setTimeout(() => {
      setSuccess(false);
      onSuccess();
    }, 850);
  };

  // Helper pour afficher le PIN ou le masquer selon l'état showPin et étape
  const displayedPin = showPin ? (step === 1 ? pin : confirmPin) : "";
  const slotsValue = (step === 1 ? pin : confirmPin).split("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 animate-fade-in">
      <Card className="w-full max-w-xs text-center shadow-xl animate-scale-in">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <KeyRound className="w-8 h-8 text-primary mb-1" />
            <CardTitle className="text-xl font-semibold mb-1">
              {step === 1 ? "Créer un code PIN" : "Confirmer le code PIN"}
            </CardTitle>
            <span className="text-xs text-muted-foreground font-medium">
              Étape {step} sur 2
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Protégez l’accès à vos données personnelles.<br />
            {step === 1
              ? "Choisissez un code PIN à 4 chiffres."
              : "Veuillez saisir à nouveau votre code PIN pour confirmer."}
          </p>
          {/* OTP Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              step === 1 ? handleNext() : handleConfirm();
            }}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <InputOTP
                maxLength={4}
                type={showPin ? "text" : "number"}
                value={step === 1 ? pin : confirmPin}
                onChange={step === 1 ? setPin : setConfirmPin}
                containerClassName="justify-center"
                inputMode="numeric"
                pattern="\d*"
                autoFocus
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3].map((idx) => (
                    <InputOTPSlot key={idx} index={idx}>
                      {
                        // Optionally show the digit or a • for masking
                        showPin
                          ? slotsValue[idx] || ""
                          : (step === 1 ? pin : confirmPin)[idx]
                            ? "•"
                            : ""
                      }
                    </InputOTPSlot>
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <button
                type="button"
                aria-label={showPin ? "Masquer le code" : "Afficher le code"}
                className="ml-2 rounded-full p-1.5 text-muted-foreground/80 bg-accent transition hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setShowPin((prev) => !prev)}
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <div className="text-xs text-red-600 mt-2 animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="flex flex-col items-center gap-2 animate-fade-in">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <span className="text-green-700 text-sm font-medium">Code PIN enregistré !</span>
              </div>
            )}
            {!success && (
              <Button
                type="submit"
                className="w-full mt-2"
                variant={step === 2 ? "default" : "secondary"}
                disabled={step === 1 ? pin.length !== 4 : confirmPin.length !== 4}
              >
                {step === 1 ? "Continuer" : "Valider"}
              </Button>
            )}
            {step === 2 && (
              <div className="mt-2">
                <Button
                  type="button"
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    setStep(1);
                    setConfirmPin("");
                    setError("");
                  }}
                >
                  ← Retour à l’étape précédente
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
