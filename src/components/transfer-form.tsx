
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TransferData } from '@/lib/types';
import { TransferSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CircleDollarSign, Landmark, User, Hash, CreditCard, Loader2, MessageSquare, Star } from 'lucide-react';
import { useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const banks = [
  'ABC Capital', 'Afirme', 'Azteca', 'Bajío', 'BanCoppel', 'Banorte', 'BBVA', 'Citibanamex', 
  'HSBC México', 'Inbursa', 'Mercado Pago', 'Nu México', 'Santander', 'Scotiabank', 'Spin by Oxxo', 'STP'
];

interface TransferFormProps {
  onSubmit: (data: TransferData) => void;
  initialData?: TransferData | null;
}

export default function TransferForm({ onSubmit, initialData }: TransferFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<TransferData>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      beneficiary: initialData?.beneficiary || '',
      bank: initialData?.bank || '',
      amount: initialData?.amount || ("" as unknown as number),
      accountType: initialData?.accountType || 'clabe',
      accountNumber: initialData?.accountNumber || '',
      concept: initialData?.concept || '',
    },
  });

  const { formState: { isSubmitting }, watch, setValue } = form;
  const accountType = watch('accountType');

  // Obtener beneficiarios frecuentes
  const beneficiariesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'beneficiaries'),
      orderBy('lastTransfer', 'desc'),
      limit(10)
    );
  }, [user, firestore]);

  const { data: beneficiaries } = useCollection(beneficiariesQuery);

  const selectBeneficiary = (b: any) => {
    setValue('beneficiary', b.name);
    setValue('bank', b.bank);
    setValue('accountType', b.accountType);
    setValue('accountNumber', b.accountNumber);
  };

  return (
    <Card className="w-full shadow-lg border-primary/10">
      <CardHeader className="pb-4">
        <CardTitle>Transferencia Bancaria</CardTitle>
        <CardDescription>
          Completa los datos para realizar el envío de fondos.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sección de Beneficiarios Frecuentes */}
        {beneficiaries && beneficiaries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#004481]">
              <Star className="w-4 h-4 fill-current" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider">Contactos frecuentes</h3>
            </div>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex gap-4">
                {beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => selectBeneficiary(b)}
                    className="flex flex-col items-center gap-2 group transition-all"
                  >
                    <Avatar className="w-12 h-12 border-2 border-slate-100 group-hover:border-[#004481] transition-colors bg-slate-50">
                      <AvatarFallback className="text-[#004481] font-bold text-xs">
                        {b.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-slate-600 font-medium max-w-[60px] truncate text-center">
                      {b.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator className="mt-2" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="beneficiary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Beneficiario</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} className="pl-9"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco Destino</FormLabel>
                       <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <SelectTrigger className="pl-9">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {banks.sort().map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto (MXN)</FormLabel>
                    <div className="relative">
                       <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} className="pl-9 font-bold"/>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Identificador</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="clabe" />
                        </FormControl>
                        <FormLabel className="font-normal">CLABE</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="card" />
                        </FormControl>
                        <FormLabel className="font-normal">Tarjeta</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    {accountType === 'clabe' ? 
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> :
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    }
                    <FormControl>
                      <Input 
                        placeholder={accountType === 'clabe' ? 'CLABE de 18 dígitos' : 'Tarjeta de 16 dígitos'} 
                        {...field} 
                        maxLength={accountType === 'clabe' ? 18 : 16} 
                        className="pl-9 font-mono"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Motivo de pago" {...field} className="pl-9"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <Button type="submit" className="w-full h-12 text-md font-bold bg-[#004481] hover:bg-[#003366]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
