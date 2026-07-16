import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';
import type { TransferData, SuccessResult } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generatePdf(transferData: TransferData, result: SuccessResult) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const { beneficiary, accountNumber, concept } = transferData;
  const folio = result.folio.split('-')[1] || result.folio;
  const timestamp = result.timestamp;

  const successGreen = '#28A745'; // Color más vivo
  const darkGray = '#222222';
  const lightGray = '#999999';
  const bgLight = '#f8f9fa';

  const pageWidth = 210;
  const centerX = pageWidth / 2;
  
  // Cabecera Verde Institucional Vibrante
  doc.setFillColor(successGreen);
  doc.rect(0, 0, pageWidth, 90, 'F');
  
  // Título
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor('#ffffff');
  doc.text("Transferencia exitosa", centerX, 25, { align: 'center' });
  
  // Fecha y Hora
  const formattedDate = new Date(timestamp).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = new Date(timestamp).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  doc.setFontSize(11);
  doc.text(`${formattedDate}, ${formattedTime}`, centerX, 35, { align: 'center' });

  // Importe Label
  doc.setFontSize(11);
  doc.text("Importe", centerX, 50, { align: 'center' });

  // Monto (Grande y centrado)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(32);
  const amountStr = `${transferData.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  doc.text(amountStr, centerX, 65, { align: 'center' });
  
  // Comisión
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text("Comisión por transferencia", centerX, 78, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text("0.00 MXN", centerX, 84, { align: 'center' });

  // --- CUERPO DEL COMPROBANTE ---
  let y = 110;

  const drawRow = (label: string, value: string) => {
    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(lightGray);
    doc.text(label.toUpperCase(), centerX, y, { align: 'center' });
    
    y += 7;
    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(darkGray);
    doc.text(value, centerX, y, { align: 'center' });
    y += 18;
  };

  // Cuenta origen (usando el formato real •45678 de la cuenta de Carlos)
  drawRow("Cuenta origen", "CUENTA • 45678");
  
  // Cuenta destino
  const destMask = accountNumber.slice(-5);
  drawRow("Cuenta destino", `${beneficiary.toUpperCase()} • ${destMask}`);
  
  // Concepto
  drawRow("Concepto", concept?.toUpperCase() || "TRANSFERENCIA MÓVIL");
  
  // Folio
  drawRow("Folio de operación", folio);
  
  // Tipo
  drawRow("Tipo de operación", "Transferencia");

  // Footer BBVA Estilizado
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(lightGray);
  // Simular espaciado de caracteres del logo
  doc.text("B B V A", centerX, y, { align: 'center' });

  doc.save(`Comprobante_BBVA_${folio}.pdf`);
}