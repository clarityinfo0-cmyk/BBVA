
'use client';

import { useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { ChevronLeft, Download, FileText, Loader2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generatePdf } from '@/lib/utils';
import type { TransferData, SuccessResult } from '@/lib/types';

interface HistoryViewProps {
  onBack: () => void;
}

export default function HistoryView({ onBack }: HistoryViewProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const transfersQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'transfers'),
      orderBy('transferDate', 'desc')
    );
  }, [user, firestore]);

  const { data: transfers, isLoading } = useCollection(transfersQuery);

  const handleDownload = async (transfer: any) => {
    // Reconstruir los datos para el generador de PDF
    const bankData = JSON.parse(transfer.bankDetails);
    
    const transferData: TransferData = {
      beneficiary: transfer.beneficiaryName,
      bank: bankData.bank,
      amount: transfer.amount,
      accountType: bankData.accountType,
      accountNumber: bankData.accountNumber,
      concept: transfer.concept || 'TRANSFERENCIA MÓVIL'
    };

    const result: SuccessResult = {
      status: 'success',
      folio: transfer.folioNumber,
      timestamp: transfer.transferDate
    };

    await generatePdf(transferData, result);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      {/* Header Estilo BBVA */}
      <div className="bg-[#004481] text-white p-4 pt-8 flex items-center gap-4 sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-medium">Últimos movimientos</h1>
      </div>

      <div className="p-4 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-[#004481] animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Cargando movimientos...</p>
          </div>
        ) : !transfers || transfers.length === 0 ? (
          <div className="text-center py-20 px-10 space-y-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No tienes transferencias registradas.</p>
            <Button onClick={onBack} className="bg-[#004481] text-white font-bold w-full max-w-xs">
                Realizar primera transferencia
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((t) => (
              <Card key={t.id} className="border-none shadow-sm rounded-none overflow-hidden bg-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-700 uppercase">{t.beneficiaryName}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(t.transferDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-[14px] font-bold text-red-600">
                      -${t.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownload(t)}
                      className="h-7 px-2 text-[#004481] hover:bg-[#004481]/5 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Comprobante
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Espaciador para la nav inferior del padre si fuera necesario */}
      <div className="h-20"></div>
    </div>
  );
}
