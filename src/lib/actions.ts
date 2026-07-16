
import type { TransferData, TransferResult } from './types';
import { v4 as uuidv4 } from 'uuid';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, increment, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

function generateFolio(): string {
  return `CG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export async function simulateTransfer(data: TransferData): Promise<TransferResult> {
  // Simulación de delay de red
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    status: 'success',
    folio: generateFolio(),
    timestamp: new Date().toISOString(),
  };
}

export async function saveTransfer(userId: string, data: TransferData, result: { folio: string; date: string; }): Promise<void> {
  try {
    const { firestore } = initializeFirebase();
    const transferId = uuidv4();
    const transferRef = doc(firestore, 'users', userId, 'transfers', transferId);
    const settingsRef = doc(firestore, 'users', userId, 'settings', 'account');
    
    const transferRecord = {
      id: transferId,
      beneficiaryName: data.beneficiary,
      bankDetails: JSON.stringify({
        bank: data.bank,
        accountType: data.accountType,
        accountNumber: data.accountNumber,
      }),
      amount: data.amount,
      transferDate: result.date,
      folioNumber: result.folio,
      status: 'success',
      concept: data.concept || 'TRANSFERENCIA MÓVIL'
    };

    setDocumentNonBlocking(transferRef, transferRecord, { merge: true });
    updateDocumentNonBlocking(settingsRef, { 
        availableBalance: increment(-data.amount) 
    });

    // Guardar o actualizar beneficiario
    await saveBeneficiary(userId, data);

  } catch (error) {
    console.error("Error al guardar transferencia:", error);
  }
}

async function saveBeneficiary(userId: string, data: TransferData) {
  const { firestore } = initializeFirebase();
  const beneficiariesRef = collection(firestore, 'users', userId, 'beneficiaries');
  
  // Buscar si ya existe por número de cuenta
  const q = query(beneficiariesRef, where('accountNumber', '==', data.accountNumber), limit(1));
  const querySnapshot = await getDocs(q);

  let beneficiaryId = uuidv4();
  if (!querySnapshot.empty) {
    beneficiaryId = querySnapshot.docs[0].id;
  }

  const beneficiaryDocRef = doc(firestore, 'users', userId, 'beneficiaries', beneficiaryId);
  setDocumentNonBlocking(beneficiaryDocRef, {
    name: data.beneficiary,
    bank: data.bank,
    accountType: data.accountType,
    accountNumber: data.accountNumber,
    lastTransfer: new Date().toISOString()
  }, { merge: true });
}

export async function updateDispersionBalance(userId: string, newBalance: number): Promise<void> {
    try {
        const { firestore } = initializeFirebase();
        const settingsRef = doc(firestore, 'users', userId, 'settings', 'account');
        setDocumentNonBlocking(settingsRef, { availableBalance: newBalance }, { merge: true });
    } catch (error) {
        console.error("Error al actualizar saldo:", error);
    }
}
