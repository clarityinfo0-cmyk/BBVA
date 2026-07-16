'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SplashScreenProps {
  children: React.ReactNode;
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [stage, setStage] = useState<'images' | 'animation' | 'app'>('images');

  const splashImage = PlaceHolderImages.find(img => img.id === 'welcome-splash')?.imageUrl || "https://picsum.photos/seed/bbva-welcome/1080/1920";

  useEffect(() => {
    // Fase 1: Imagen inspiracional (2.5 segundos para dar tiempo a la PWA de cargar)
    const timer1 = setTimeout(() => {
      setStage('animation');
    }, 2500);

    // Fase 2: Animación BBVA (2 segundos más)
    const timer2 = setTimeout(() => {
      setStage('app');
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (stage === 'app') {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden">
      {stage === 'images' && (
        <div className="relative w-full h-full animate-fade-in">
          <Image
            src={splashImage}
            alt="Bienvenida"
            fill
            className="object-cover"
            priority
            data-ai-hint="lifestyle success"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#004481]/80 to-transparent flex items-end p-10">
            <div className="text-white space-y-2">
              <h1 className="text-4xl font-bold">Bienvenido</h1>
              <p className="text-lg opacity-90">Tu banca digital, siempre contigo.</p>
            </div>
          </div>
        </div>
      )}

      {stage === 'animation' && (
        <div className="w-full h-full bg-[#004481] flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <span className="text-7xl font-bold text-white tracking-tighter animate-bbva-logo">
              BBVA
            </span>
            <div className="absolute -bottom-4 left-0 w-full h-1 bg-white/30 overflow-hidden">
              <div className="h-full bg-white animate-loading-bar"></div>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-12 uppercase tracking-widest font-medium animate-pulse">
            Iniciando sesión segura
          </p>
        </div>
      )}
    </div>
  );
}
