import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { PresetPdfSlots } from "@/lib/schemas/presets/types";
import { createPdfBlob } from "./create-pdf-blob";
import { downloadFile } from "./download-file";
import { generateInvoiceName } from "./invoice-name";

type Init = { data: InvoiceSchema; pdfSlots?: PresetPdfSlots };

export async function viewPdf({ data, pdfSlots }: Init) {
  const blob = await createPdfBlob({ data, pdfSlots });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadPdf({ data, pdfSlots }: Init) {
  const blob = await createPdfBlob({ data, pdfSlots });
  const url = URL.createObjectURL(blob);
  downloadFile({ url, fileName: generateInvoiceName(data, "pdf") });
  URL.revokeObjectURL(url);
}
