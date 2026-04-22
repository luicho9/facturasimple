"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HeaderActions } from "@/components/sidebar/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyDetails } from "@/components/create/company-details";
import { ClientDetails } from "@/components/create/client-details";
import { InvoiceDetails } from "@/components/create/invoice-details";
import { InvoiceItems } from "@/components/create/invoice-items";
import { AdditionalInformation } from "@/components/create/additional-information";
import { InvoicePreview } from "@/components/create/invoice-preview";
import { InvoiceForm } from "@/components/create/invoice-form";
import { DownloadActions } from "@/components/create/download-actions";
import { ClientPicker } from "@/components/create/client-picker";
import { PresetKey, presets } from "@/lib/schemas/presets/registry";
import { mergeDefaults } from "@/lib/create/defaults";
import { getInvoiceSaveDecision } from "@/lib/create/save-policy";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { Client, Company } from "@/lib/db/schema";
import { saveInvoice } from "@/app/(dashboard)/create/actions";

interface CreateViewProps {
  company: Company | null;
  clients: Client[];
  initialClientId: string | null;
  downloadOnlyMessage: string | null;
}

export function CreateView({
  company,
  clients,
  initialClientId,
  downloadOnlyMessage,
}: CreateViewProps) {
  const router = useRouter();
  const [formVersion, setFormVersion] = useState(0);

  const initialPreset: PresetKey =
    company?.defaultPreset && company.defaultPreset in presets
      ? (company.defaultPreset as PresetKey)
      : "default";

  const [presetKey, setPresetKey] = useState<PresetKey>(initialPreset);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    initialClientId,
  );

  const preset = presets[presetKey];

  const defaults = useMemo<InvoiceSchema>(() => {
    const selectedClient =
      selectedClientId && clients.find((c) => c.id === selectedClientId);

    return mergeDefaults(
      preset.invoiceDefaults,
      company,
      selectedClient || null,
      presetKey,
    );
  }, [preset.invoiceDefaults, company, clients, selectedClientId, presetKey]);

  async function handleAfterDownload(data: InvoiceSchema) {
    if (!company) {
      return;
    }

    const decision = getInvoiceSaveDecision({
      canAttemptSave: true,
      invoice: data,
    });
    if (decision.action === "skip") {
      toast.info(decision.message);
      return;
    }

    try {
      const saved = await saveInvoice(decision.invoice, selectedClientId);
      if (!saved.ok) {
        toast.warning(`PDF descargado, pero no se guardó: ${saved.message}`);
        return;
      }

      toast.success(`Factura ${saved.invoiceNumber} descargada y guardada`);
      setSelectedClientId(null);
      setFormVersion((v) => v + 1);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? `PDF descargado, pero no se pudo guardar el registro: ${err.message}`
          : "PDF descargado, pero no se pudo guardar el registro",
      );
    }
  }

  return (
    <InvoiceForm
      key={`${presetKey}:${formVersion}`}
      defaults={defaults}
      fieldsSchema={preset.fieldsSchema}
    >
      <HeaderActions>
        <DownloadActions
          pdfSlots={preset.pdf}
          onAfterDownload={company ? handleAfterDownload : undefined}
        />
      </HeaderActions>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between rounded-t-2xl border px-4 py-2">
            <span className="text-sm font-medium">Plantilla</span>
            <Select
              value={presetKey}
              onValueChange={(v) => setPresetKey(v as PresetKey)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(presets).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="company"
            className="rounded-t-none border-t-0"
          >
            <AccordionItem value="company">
              <AccordionTrigger>Datos de la empresa</AccordionTrigger>
              <AccordionContent>
                <CompanyDetails />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="client">
              <AccordionTrigger>Datos del cliente</AccordionTrigger>
              <AccordionContent>
                <ClientPicker
                  clients={clients}
                  selectedId={selectedClientId}
                  onSelect={setSelectedClientId}
                />
                <ClientDetails />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="invoice">
              <AccordionTrigger>Datos de la factura</AccordionTrigger>
              <AccordionContent>
                <InvoiceDetails />
              </AccordionContent>
            </AccordionItem>

            {preset.FormFields && (
              <AccordionItem value="preset-fields">
                <AccordionTrigger>
                  Datos fiscales ({preset.label})
                </AccordionTrigger>
                <AccordionContent>
                  <preset.FormFields />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="items">
              <AccordionTrigger>Detalle</AccordionTrigger>
              <AccordionContent>
                <InvoiceItems />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="additional-information">
              <AccordionTrigger>Información adicional</AccordionTrigger>
              <AccordionContent>
                <AdditionalInformation />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {company && (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              Se guarda automáticamente al descargar.
            </p>
          )}
          {downloadOnlyMessage && (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              {downloadOnlyMessage}
            </p>
          )}
        </div>

        <InvoicePreview preview={preset.preview} />
      </section>
    </InvoiceForm>
  );
}
