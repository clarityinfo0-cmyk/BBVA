'use client';

import { useEffect, useRef } from 'react';
import type { TransferData, TransferResult } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, XCircle, ChevronLeft } from 'lucide-react';
import { generatePdf } from '@/lib/utils';
import { saveTransfer } from '@/lib/actions';
import { useUser } from '@/firebase';

interface ResultViewProps {
  transferData: TransferData;
  result: TransferResult;
  onReset: () => void;
  onTryAgain: () => void;
  onContinue: () => void;
}

export default function ResultView({ transferData, result, onReset, onTryAgain }: ResultViewProps) {
  const { user } = useUser();
  const hasSaved = useRef(false);
  
  useEffect(() => {
    const autoSave = async () => {
      if (result.status === 'success' && 'folio' in result && user && !hasSaved.current) {
        hasSaved.current = true;
        await saveTransfer(user.uid, transferData, { folio: result.folio, date: result.timestamp });
      }
    };
    autoSave();
  }, [result, user, transferData]);

  const handleDownloadPdf = async () => {
    if (result.status !== 'success') return;
    await generatePdf(transferData, result);
  }

  if (result.status === 'error') {
    return (
      <Card className="shadow-lg border-none overflow-hidden">
        <div className="bg-destructive p-8 flex flex-col items-center justify-center text-white">
          <XCircle className="w-16 h-16 mb-4" />
          <h2 className="text-xl font-bold">{result.title}</h2>
        </div>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-6">{result.message}</p>
          <Button onClick={onTryAgain} className="w-full bg-[#004481] hover:bg-[#003366]">Reintentar</Button>
        </CardContent>
      </Card>
    );
  }

  if (result.status !== 'success' || !('folio' in result)) return null;

  const formattedDate = new Date(result.timestamp).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = new Date(result.timestamp).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in overflow-y-auto no-scrollbar">
      {/* Header Verde BBVA Vibrante */}
      <div className="bg-[#28A745] text-white p-6 pt-12 pb-10 flex flex-col items-center text-center relative shrink-0">
        <h2 className="text-[17px] font-medium mb-8">Transferencia exitosa</h2>
        
        <div className="space-y-1">
          <p className="text-[13px] opacity-90">{formattedDate}, {formattedTime}</p>
          <p className="text-[13px] opacity-90 pt-4">Importe</p>
          <h1 className="text-[34px] font-light tracking-tight leading-tight">
            {transferData.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
          </h1>
        </div>

        <div className="mt-6 space-y-0.5">
          <p className="text-[11px] italic opacity-75">Comisión por transferencia</p>
          <p className="text-[13px] opacity-90">0.00 MXN</p>
        </div>
      </div>

      {/* Datos del Comprobante */}
      <div className="flex-1 px-8 py-10 space-y-9 text-center">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Cuenta origen</p>
          <p className="text-[15px] font-bold text-slate-800">CUENTA • 45678</p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Cuenta destino</p>
          <p className="text-[15px] font-bold text-slate-800">
            {transferData.beneficiary.toUpperCase()} • {transferData.accountNumber.slice(-5)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Concepto</p>
          <p className="text-[15px] font-bold text-slate-800">
            {transferData.concept?.toUpperCase() || 'TRANSFERENCIA MÓVIL'}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Folio de operación</p>
          <p className="text-[15px] font-bold text-slate-800">{result.folio.split('-')[1] || result.folio}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Tipo de operación</p>
          <p className="text-[15px] font-bold text-slate-800">Transferencia</p>
        </div>

        <div className="pt-10">
          <p className="text-[13px] text-slate-300 font-bold tracking-[0.4em] uppercase">BBVA</p>
        </div>
      </div>

      {/* Botones de Acción Fijos */}
      <div className="p-6 bg-[#f4f4f4] border-t border-slate-200 space-y-3 sticky bottom-0">
        <Button 
          variant="outline" 
          onClick={handleDownloadPdf} 
          className="w-full h-12 border-[#004481] text-[#004481] hover:bg-slate-100 font-bold text-[14px] uppercase"
        >
          <Download className="mr-2 h-4 w-4" />
          Compartir Comprobante
        </Button>
        <Button 
          onClick={onReset} 
          className="w-full h-12 bg-[#004481] hover:bg-[#003366] text-white font-bold text-[14px] uppercase"
        >
          Salir
        </Button>
      </div>
    </div>
  );
}