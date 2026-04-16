import type { InvoiceSchema } from "@/lib/schemas/invoice";

export function generateInvoiceName(data: InvoiceSchema, extension: "pdf") {
  const number = `${data.invoice.invoicePrefix ?? ""}${data.invoice.serialNumber}`;
  const safe = number.replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "");
  return `factura-${safe || "sin-numero"}.${extension}`;
}
