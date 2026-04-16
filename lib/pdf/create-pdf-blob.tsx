import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { PresetPdfSlots } from "@/lib/schemas/presets/types";

interface CreatePdfBlobProps {
  data: InvoiceSchema;
  pdfSlots?: PresetPdfSlots;
}
export async function createPdfBlob({
  data,
  pdfSlots,
}: CreatePdfBlobProps): Promise<Blob> {
  const [{ pdf }, { DefaultInvoicePdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/default"),
  ]);
  return pdf(<DefaultInvoicePdf data={data} pdfSlots={pdfSlots} />).toBlob();
}
