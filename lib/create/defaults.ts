import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { Company, Client } from "@/lib/db/schema";

type LabelValue = { label: string; value: string };

function asLabelValueArray(value: unknown): LabelValue[] {
  return Array.isArray(value) ? (value as LabelValue[]) : [];
}

function companyToCompanyDefaults(company: Company): InvoiceSchema["company"] {
  return {
    logo: company.logoUrl ?? null,
    signature: company.signatureUrl ?? null,
    name: company.name,
    address: company.address,
    email: company.email,
    phone: company.phone,
    metadata: asLabelValueArray(company.metadata),
  };
}

function clientToClientDefaults(client: Client): InvoiceSchema["client"] {
  return {
    name: client.name,
    address: client.address,
    email: client.email,
    phone: client.phone,
    metadata: asLabelValueArray(client.metadata),
  };
}

function asPresetFields(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function mergeDefaults(
  presetDefaults: InvoiceSchema,
  company: Company | null,
  client: Client | null,
  presetKey: string,
): InvoiceSchema {
  if (!company) {
    return client
      ? { ...presetDefaults, client: clientToClientDefaults(client) }
      : presetDefaults;
  }

  const savedPresetFields =
    company.defaultPreset === presetKey
      ? asPresetFields(company.defaultPresetFields)
      : {};

  return {
    ...presetDefaults,
    company: companyToCompanyDefaults(company),
    client: client ? clientToClientDefaults(client) : presetDefaults.client,
    invoice: {
      ...presetDefaults.invoice,
      currency: company.defaultCurrency || presetDefaults.invoice.currency,
      themeColor:
        company.defaultThemeColor || presetDefaults.invoice.themeColor,
      invoiceNumber:
        presetKey === "default" && company.invoicePrefix
          ? `${company.invoicePrefix}${presetDefaults.invoice.invoiceNumber}`
          : presetDefaults.invoice.invoiceNumber,
      paymentTerms:
        company.defaultPaymentTerms || presetDefaults.invoice.paymentTerms,
    },
    additionalInfo: {
      ...presetDefaults.additionalInfo,
      notes: company.defaultNotes || presetDefaults.additionalInfo.notes,
      terms: company.defaultTerms || presetDefaults.additionalInfo.terms,
      paymentInformation:
        asLabelValueArray(company.defaultPaymentInformation).length > 0
          ? asLabelValueArray(company.defaultPaymentInformation)
          : presetDefaults.additionalInfo.paymentInformation,
    },
    presetFields: {
      ...(presetDefaults.presetFields ?? {}),
      ...savedPresetFields,
    },
  };
}
