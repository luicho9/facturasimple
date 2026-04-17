"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Algo salió mal
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-balance">
        Ocurrió un error inesperado. Puedes reintentar o volver al inicio.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          ID: {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={() => unstable_retry()}>Reintentar</Button>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
}
