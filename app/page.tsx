import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingDemo } from "@/components/landing/landing-demo";

const REPO_URL = "https://github.com/luicho9/facturasimple";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Image
            src="/logo.png"
            alt="Factura Simple"
            width={600}
            height={600}
            className="size-5"
          />
          Factura Simple
        </Link>
        <Link
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          GitHub
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center px-4 pt-12 pb-16 sm:px-6">
        <section className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            La forma más simple de facturar.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground text-balance sm:text-lg">
            Completa los datos, descarga el PDF. Sin cuentas, sin
            complicaciones.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/create">Crear factura</Link>
          </Button>
        </section>

        <section className="w-full mt-12">
          <LandingDemo />
        </section>
      </div>

      <footer className="flex items-center justify-between px-6 py-6 text-xs text-muted-foreground">
        <span>
          Hecho por{" "}
          <Link
            href="https://joseluisflores.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Jose Luis Flores
          </Link>
        </span>
        <Link
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </Link>
      </footer>
    </main>
  );
}
