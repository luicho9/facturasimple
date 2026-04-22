import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://facturasimple.app"),
  title: {
    default: "Factura Simple",
    template: "%s · Factura Simple",
  },
  description: "Genera facturas profesionales de forma rápida y sencilla",
  openGraph: {
    type: "website",
    siteName: "Factura Simple",
    title: "Factura Simple",
    description: "Genera facturas profesionales de forma rápida y sencilla",
    url: "/",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Factura Simple",
    description: "Genera facturas profesionales de forma rápida y sencilla",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
