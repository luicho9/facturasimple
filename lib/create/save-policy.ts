import { invoiceSchema, type InvoiceSchema } from "@/lib/schemas/invoice";

export type InvoiceSaveDecision =
  | { action: "save"; invoice: InvoiceSchema }
  | { action: "skip"; message: string };

export function getInvoiceSaveDecision({
  canAttemptSave,
  invoice,
}: {
  canAttemptSave: boolean;
  invoice: InvoiceSchema;
}): InvoiceSaveDecision {
  if (!canAttemptSave) {
    return {
      action: "skip",
      message: "PDF descargado sin guardarse.",
    };
  }

  const result = invoiceSchema.safeParse(invoice);
  if (!result.success) {
    return {
      action: "skip",
      message:
        "PDF descargado sin guardarse. Completa los datos requeridos para guardar la factura.",
    };
  }

  return { action: "save", invoice: result.data };
}
