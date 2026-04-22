"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download04Icon,
  EyeIcon,
  FileDownloadIcon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { PresetPdfSlots } from "@/lib/schemas/presets/types";
import { downloadPdf, viewPdf } from "@/lib/pdf/invoice-download-manager";

type Action = "view-pdf" | "download-pdf";

interface DownloadActionsProps {
  pdfSlots?: PresetPdfSlots;
  onAfterDownload?: (data: InvoiceSchema) => Promise<void> | void;
}

export function DownloadActions({
  pdfSlots,
  onAfterDownload,
}: DownloadActionsProps) {
  const { getValues } = useFormContext<InvoiceSchema>();
  const [busy, setBusy] = useState(false);

  const handle = async (action: Action) => {
    setBusy(true);
    try {
      const data = getValues();
      const init = { data, pdfSlots };
      if (action === "view-pdf") await viewPdf(init);
      else if (action === "download-pdf") {
        await downloadPdf(init);
        await onAfterDownload?.(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar el documento. Revisa la consola.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={busy}>
          <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
          Descargar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => handle("view-pdf")}>
          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
          <span>Ver PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handle("download-pdf")}>
          <HugeiconsIcon icon={FileDownloadIcon} strokeWidth={2} />
          <span>Descargar PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
