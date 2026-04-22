import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { CompanySchema } from "@/lib/schemas/company";
import { CompanyForm } from "@/components/company/company-form";
import { getCompanyByUserId } from "@/lib/db/queries/company";

export default async function CompanyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  const row = await getCompanyByUserId(session.user.id);
  if (!row) {
    return null;
  }

  const defaults: CompanySchema = {
    name: row.name,
    address: row.address,
    email: row.email,
    phone: row.phone,
    logoUrl: row.logoUrl,
    signatureUrl: row.signatureUrl,
    defaultCurrency: row.defaultCurrency,
    defaultThemeColor: row.defaultThemeColor,
    defaultPreset: row.defaultPreset,
    defaultPresetFields:
      (row.defaultPresetFields as Record<string, unknown>) ?? {},
    invoicePrefix: row.invoicePrefix,
    defaultPaymentTerms: row.defaultPaymentTerms,
    defaultNotes: row.defaultNotes,
    defaultTerms: row.defaultTerms,
  };

  return (
    <div className="flex flex-col gap-6">
      <CompanyForm defaults={defaults} />
    </div>
  );
}
