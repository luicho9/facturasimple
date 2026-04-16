"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CompanyDetails } from "@/components/create/company-details";
import { ClientDetails } from "@/components/create/client-details";
import { InvoiceDetails } from "@/components/create/invoice-details";
import { InvoiceItems } from "@/components/create/invoice-items";
import { AdditionalInformation } from "@/components/create/additional-information";
import { InvoicePreview } from "@/components/create/invoice-preview";
import { InvoiceForm } from "@/components/create/invoice-form";
import { useState } from "react";
import { PresetKey, presets } from "@/lib/schemas/presets/registry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [presetKey, setPresetKey] = useState<PresetKey>("default");

  const defaults = presets[presetKey].invoiceDefaults;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <InvoiceForm key={presetKey} defaults={defaults}>
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
                <ClientDetails />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="invoice">
              <AccordionTrigger>Datos de la factura</AccordionTrigger>
              <AccordionContent>
                <InvoiceDetails />
              </AccordionContent>
            </AccordionItem>

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
        </div>

        <InvoicePreview />
      </InvoiceForm>
    </section>
  );
}
