import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CreateView } from "@/components/create/create-view";
import { getCompanyAndClients } from "@/lib/db/queries/create";

interface PageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { clientId } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <CreateView
        company={null}
        clients={[]}
        initialClientId={null}
        downloadOnlyMessage="Esta factura se descargará sin guardarse. Inicia sesión para guardar tu historial."
      />
    );
  }

  const { company, clients } = await getCompanyAndClients(session.user.id);

  const initialClientId =
    clientId && clients.some((c) => c.id === clientId) ? clientId : null;
  const hasCompleteCompanyProfile = Boolean(
    company?.name.trim() && company.address.trim(),
  );

  function getDownloadOnlyMessage() {
    if (!company) {
      return "Esta factura se descargará sin guardarse. Configura tu empresa para guardar facturas.";
    }
    if (!hasCompleteCompanyProfile) {
      return "Completa los datos requeridos de empresa en esta factura para guardarla en tu historial.";
    }
    return null;
  }

  return (
    <CreateView
      company={company}
      clients={clients}
      initialClientId={initialClientId}
      downloadOnlyMessage={getDownloadOnlyMessage()}
    />
  );
}
