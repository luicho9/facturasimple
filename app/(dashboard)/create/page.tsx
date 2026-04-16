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

export default function Page() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <InvoiceForm>
        <Accordion type="single" collapsible defaultValue="company">
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

        <InvoicePreview />
      </InvoiceForm>
    </section>
  );
}
