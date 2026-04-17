import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-balance">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}
