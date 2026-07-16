'use server';

/**
 * @fileOverview Un flujo para generar un resumen de una transferencia bancaria simulada usando IA.
 *
 * - generateTransferSummary - Genera un resumen de una transferencia bancaria.
 * - TransferSummaryInput - El tipo de entrada para la función generateTransferSummary.
 * - TransferSummaryOutput - El tipo de retorno para la función generateTransferSummary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransferSummaryInputSchema = z.object({
  beneficiary: z.string().describe('El nombre del beneficiario de la transferencia.'),
  bankDetails: z.string().describe('Los detalles bancarios del beneficiario.'),
  amount: z.number().describe('El monto transferido.'),
  folioNumber: z.string().describe('El número de folio de la transferencia.'),
  date: z.string().describe('La fecha de la transferencia.'),
});
export type TransferSummaryInput = z.infer<typeof TransferSummaryInputSchema>;

const TransferSummaryOutputSchema = z.object({
  summary: z.string().describe('Un resumen de los detalles de la transferencia.'),
});
export type TransferSummaryOutput = z.infer<typeof TransferSummaryOutputSchema>;

export async function generateTransferSummary(input: TransferSummaryInput): Promise<TransferSummaryOutput> {
  return generateTransferSummaryFlow(input);
}

const transferSummaryPrompt = ai.definePrompt({
  name: 'transferSummaryPrompt',
  input: {schema: TransferSummaryInputSchema},
  output: {schema: TransferSummaryOutputSchema},
  prompt: `Eres un asistente de IA especializado en resumir detalles de transferencias bancarias.
  Genera un resumen conciso de la siguiente transferencia:

  Beneficiario: {{{beneficiary}}}
  Detalles Bancarios: {{{bankDetails}}}
  Monto: {{{amount}}}
  Número de Folio: {{{folioNumber}}}
  Fecha: {{{date}}}

  Resumen:`, 
});

const generateTransferSummaryFlow = ai.defineFlow(
  {
    name: 'generateTransferSummaryFlow',
    inputSchema: TransferSummaryInputSchema,
    outputSchema: TransferSummaryOutputSchema,
  },
  async input => {
    const {output} = await transferSummaryPrompt(input);
    return output!;
  }
);
