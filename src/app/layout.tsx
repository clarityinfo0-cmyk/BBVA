
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { SplashScreen } from '@/components/splash-screen';

export const metadata: Metadata = {
  title: 'BBVA México',
  description: 'Banca por Internet - BBVA México',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BBVA',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#004481',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/bbva-apple/180/180" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased h-full bg-[#f4f4f4] dark:bg-background overflow-x-hidden">
        <FirebaseClientProvider>
          <SplashScreen>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1 p-4 md:p-6">
                {children}
              </main>
              <footer className="p-6 text-center text-[10px] text-muted-foreground bg-[#f4f4f4] mt-auto pb-20">
                <p>© 2024 BBVA México, S.A., Institución de Banca Múltiple, Grupo Financiero BBVA México.</p>
              </footer>
              <Toaster />
            </div>
          </SplashScreen>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
