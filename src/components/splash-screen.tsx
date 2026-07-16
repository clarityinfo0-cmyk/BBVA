'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  children: React.ReactNode;
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  if (hide) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#004481] splash-fade">

        <div className="absolute inset-0 bg-gradient-to-b from-[#0057A8] via-[#004481] to-[#003A70]" />

        <div className="absolute w-[700px] h-[700px] rounded-full bg-white/5 blur-3xl -top-40 -left-40 animate-pulse" />

        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl bottom-[-150px] right-[-150px] animate-pulse" />

        <div className="relative flex flex-col items-center">

          <div className="relative">

            <Image
              src="/android-chrome-512x512.png"
              alt="BBVA"
              width={150}
              height={150}
              priority
              className="logo-animation"
            />

            <div className="logo-shine" />

          </div>

          <h1 className="mt-10 text-white text-5xl font-bold tracking-tight title-animation">
            BBVA
          </h1>

          <p className="mt-2 text-white/70 tracking-[6px] text-sm uppercase">
            Banca Digital
          </p>

          <div className="mt-16 w-64 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="loading-bar h-full bg-white" />
          </div>

          <p className="mt-6 text-white/60 text-xs tracking-[5px] animate-pulse">
            Cargando...
          </p>

        </div>

      </div>
    </>
  );
}