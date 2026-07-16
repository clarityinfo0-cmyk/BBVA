'use client';

import { useState, useCallback, useEffect } from 'react';
import type { TransferData, TransferResult } from '@/lib/types';
import TransferForm from '@/components/transfer-form';
import ProcessingView from '@/components/processing-view';
import ResultView from '@/components/result-view';
import HistoryView from '@/components/history-view';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeftRight, 
  Plus, 
  Smartphone, 
  MoreHorizontal,
  Home as HomeIcon,
  Heart,
  MessageSquare,
  User,
  HelpCircle,
  Menu,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useMemoFirebase, useDoc } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { updateDispersionBalance } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ViewState = 'dashboard' | 'form' | 'processing' | 'result' | 'history';

export default function Home() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [result, setResult] = useState<TransferResult | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [newBalance, setNewBalance] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const settingsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'settings', 'account');
  }, [user, firestore]);

  const { data: settings, isLoading: isLoadingSettings } = useDoc<{availableBalance: number}>(settingsRef);

  const handleFormSubmit = (data: TransferData) => {
    setTransferData(data);
    setResult(null); 
    setView('processing');
  };

  const handleProcessingComplete = useCallback((res: TransferResult) => {
    setResult(res);
    setView('result');
  }, []);

  const handleReset = () => {
    setView('dashboard');
    setTransferData(null);
    setResult(null);
  };

  const handleSaveBalance = async () => {
    if (user && newBalance !== '') {
      await updateDispersionBalance(user.uid, parseFloat(newBalance));
      setIsEditDialogOpen(false);
      setNewBalance('');
    }
  };

  // Renderizado condicional de vistas
  if (view === 'history') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#f4f4f4] -m-4 md:-m-6">
        <HistoryView onBack={() => setView('dashboard')} />
      </div>
    );
  }

  if (view !== 'dashboard') {
    return (
      <div className="max-w-md mx-auto space-y-4 pt-4 px-4 pb-20">
        {view === 'form' && (
            <>
                <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-2 text-[#004481] p-0 hover:bg-transparent">
                    <ChevronRight className="rotate-180 mr-1 w-4 h-4" /> Volver
                </Button>
                <TransferForm onSubmit={handleFormSubmit} initialData={transferData} />
            </>
        )}
        {view === 'processing' && <ProcessingView transferData={transferData!} onComplete={handleProcessingComplete} />}
        {view === 'result' && <ResultView transferData={transferData!} result={result!} onReset={handleReset} onTryAgain={() => setView('form')} onContinue={() => {}} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] -m-4 md:-m-6 overflow-x-hidden">
      {/* BBVA Header Section */}
      <div className="bg-[#004481] text-white pt-10 pb-20 px-6 relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">CG</div>
             <h1 className="text-lg font-medium">Hola Carlos Guerrero</h1>
          </div>
          <div className="flex items-center gap-5">
            <HelpCircle className="w-6 h-6 stroke-[1.5] cursor-pointer" />
            <Menu className="w-6 h-6 stroke-[1.5] cursor-pointer" />
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-around items-start text-center mb-4">
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setView('form')}>
            <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">Transferir</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group opacity-80">
            <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">Oportuni- <br/> dades</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group opacity-80">
            <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium tracking-tight leading-tight">Retiro sin <br/> tarjeta</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group opacity-80">
            <div className="bg-white/10 p-2.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">Más</span>
          </div>
        </div>

        {/* Diagonal Wave Shape */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-10 bg-[#f4f4f4]" 
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}
        ></div>
      </div>

      {/* Content Area */}
      <div className="max-w-md mx-auto w-full px-4 -mt-10 space-y-4 relative z-20 pb-32">
        
        {/* Cuentas en Pesos Section */}
        <Card className="border-none shadow-sm rounded-none overflow-hidden bg-white">
          <div className="px-4 py-3 bg-white flex justify-between items-center border-b border-slate-50">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cuentas en pesos</h2>
            <div onClick={() => setShowBalance(!showBalance)} className="cursor-pointer p-1">
              {showBalance ? <Eye className="w-4 h-4 text-[#004481]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
          <CardContent className="px-4 pb-5 pt-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5 cursor-pointer" onClick={() => setView('history')}>
                <div className="flex items-center gap-2">
                  <p className="text-[#004481] font-bold text-[13px] tracking-wide uppercase">Libretón Premium</p>
                  <div className="w-3 h-3 rounded-full border border-[#004481] flex items-center justify-center p-0.5">
                    <div className="w-full h-full rounded-full bg-[#004481]"></div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-[0.2em]">•6789</p>
              </div>
              
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <div className="text-right cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors group">
                    <div className="text-xl font-medium text-slate-700 flex items-center justify-end gap-1">
                        {isLoadingSettings ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <>
                              {showBalance ? `$${(settings?.availableBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '••••••'}
                              <Pencil className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Saldo disponible</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] sm:max-w-[425px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-[#004481]">Editar Saldo Disponible</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="balance">Nuevo Monto (MXN)</Label>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="0.00"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="font-bold text-lg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveBalance} className="bg-[#004481] w-full font-bold">
                      Actualizar Saldo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Tarjetas Section */}
        <Card className="border-none shadow-sm rounded-none overflow-hidden bg-white">
          <div className="px-4 py-3 bg-white">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tarjetas</h2>
          </div>
          <CardContent className="p-0">
            {/* Débito 8396 */}
            <div 
              className="px-4 py-6 flex items-center gap-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setView('history')}
            >
              <div className="w-16 h-10 bg-[#009BD6] rounded-md flex items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-1 right-2 flex flex-col items-end">
                    <div className="text-[5px] text-white/50 font-bold leading-none uppercase">BBVA</div>
                </div>
                <div className="w-3.5 h-2.5 bg-yellow-400/80 rounded-[2px] absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-[1px] p-[1px]">
                   <div className="w-full h-[0.5px] bg-black/10"></div>
                   <div className="w-full h-[0.5px] bg-black/10"></div>
                   <div className="w-full h-[0.5px] bg-black/10"></div>
                </div>
                <div className="absolute bottom-1 right-2 text-[5px] text-white/50 font-bold">VISA</div>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-[#004481]">DÉBITO</p>
                <p className="text-[11px] text-slate-500 font-medium tracking-[0.2em] mt-0.5">•8396</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#004481]" />
            </div>

            {/* Crédito 5432 */}
            <div 
              className="px-4 py-6 space-y-4 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setView('history')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-[#002B54] rounded-md flex items-center justify-center relative overflow-hidden shadow-sm">
                   <div className="absolute top-1 right-2 flex flex-col items-end">
                      <div className="text-[5px] text-white/50 font-bold leading-none uppercase">BBVA</div>
                   </div>
                   <div className="w-3.5 h-2.5 bg-yellow-400/80 rounded-[2px] absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-[1px] p-[1px]">
                      <div className="w-full h-[0.5px] bg-black/10"></div>
                      <div className="w-full h-[0.5px] bg-black/10"></div>
                      <div className="w-full h-[0.5px] bg-black/10"></div>
                   </div>
                   <div className="absolute bottom-1 right-2 text-[5px] text-white/50 font-bold">VISA</div>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#004481]">CRÉDITO AZUL</p>
                  <p className="text-[11px] text-slate-500 font-medium tracking-[0.2em] mt-0.5">•5432</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#004481]" />
              </div>
              <div className="flex justify-between pt-1">
                 <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Crédito disponible</span>
                  <span className="text-sm font-medium text-slate-700">$12,000.00</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Saldo Utilizado</span>
                  <span className="text-sm font-medium text-slate-700">$5,400.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-[72px] px-2 z-[50]">
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setView('dashboard')}>
          <HomeIcon className="w-7 h-7 text-[#004481]" />
          <div className="w-1 h-1 rounded-full bg-[#004481]"></div>
        </div>
        <div className="flex flex-col items-center text-slate-400 cursor-pointer">
          <Heart className="w-7 h-7" />
        </div>
        <div className="flex items-center justify-center bg-[#004481] w-12 h-12 rounded-full text-white shadow-md border-4 border-[#f4f4f4] -mt-8 cursor-pointer" onClick={() => setView('form')}>
          <Plus className="w-7 h-7 stroke-[3]" />
        </div>
        <div className="flex flex-col items-center text-slate-400 cursor-pointer" onClick={() => setView('history')}>
          <MessageSquare className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-center text-slate-400 cursor-pointer">
          <User className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
