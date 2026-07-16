'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { simulateTransfer } from '@/lib/actions';
import type { TransferData, TransferResult } from '@/lib/types';

interface ProcessingViewProps {
  transferData: TransferData;
  onComplete: (result: TransferResult) => void;
}

const steps = [
  'Verificando cuenta...',
  'Validando fondos...',
  'Autorizando SPEI...',
];

export default function ProcessingView({ transferData, onComplete }: ProcessingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const process = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(i + 1);
      }
      const result = await simulateTransfer(transferData);
      onComplete(result);
    };

    process();
  }, [onComplete, transferData]);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="items-center text-center bg-[#004481] text-white py-8">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <CardTitle className="text-xl">Procesando Transferencia</CardTitle>
        <CardDescription className="text-white/80">
            {steps[Math.min(currentStep, steps.length - 1)]}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 px-6">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center text-sm font-medium">
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6 text-[#1464A5] mr-4" />
              ) : (
                <div className="w-6 h-6 border-2 border-slate-200 rounded-full flex items-center justify-center mr-4">
                  {index === currentStep && <Loader2 className="w-4 h-4 animate-spin text-[#004481]" />}
                </div>
              )}
              <span className={index < currentStep ? 'text-muted-foreground' : 'text-[#004481]'}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
