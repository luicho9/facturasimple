"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Algo salió mal
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground text-balance">
            La aplicación encontró un error crítico. Intenta recargar la página.
          </p>
          {error.digest && (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => unstable_retry()}
            className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
