import { z } from 'zod';

export const TransferSchema = z.object({
  beneficiary: z.string().min(3, { message: 'El nombre del beneficiario debe tener al menos 3 caracteres.' }),
  bank: z.string().nonempty({ message: 'Por favor, selecciona un banco.' }),
  amount: z.coerce.number().positive({ message: 'El monto debe ser positivo.' }),
  accountType: z.enum(['clabe', 'card'], { required_error: 'Por favor, selecciona un tipo de cuenta.' }),
  accountNumber: z.string().min(1, { message: 'El número de cuenta es requerido.' }),
  concept: z.string().optional().default('Transferencia Móvil'),
}).refine(data => {
    if (data.accountType === 'clabe') {
      return /^\d{18}$/.test(data.accountNumber);
    }
    return true;
}, {
    message: 'La CLABE debe tener 18 dígitos.',
    path: ['accountNumber'],
}).refine(data => {
    if (data.accountType === 'card') {
        return /^\d{16}$/.test(data.accountNumber);
    }
    return true;
}, {
    message: 'El número de tarjeta debe tener 16 dígitos.',
    path: ['accountNumber'],
});


export type TransferData = z.infer<typeof TransferSchema>;

export type SuccessResult = {
  status: 'success';
  folio: string;
  timestamp: string;
};

export type ErrorResult = {
  status: 'error';
  message: string;
  code: string;
  title: string;
};

export type LoadingResult = {
    status: 'loading';
    message: string;
};

export type TransferResult = SuccessResult | ErrorResult | LoadingResult;
