import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginButton } from "@/components/login-button";

interface LoginPageProps {
  searchParams: Promise<{ callbackURL?: string }>;
}

function safeCallback(input: string | undefined): string {
  if (!input || !input.startsWith("/") || input.startsWith("//")) {
    return "/company";
  }
  return input;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackURL } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const target = safeCallback(callbackURL);

  if (session) {
    redirect(target);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guarda tus facturas y accede a ellas desde cualquier dispositivo.
        </p>
        <LoginButton callbackURL={target} />
      </div>
    </main>
  );
}
