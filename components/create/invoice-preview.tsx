"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { PresetPreviewSlots } from "@/lib/schemas/presets/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { computeInvoiceTotals } from "@/lib/billing";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

interface InvoicePreviewProps {
  preview?: PresetPreviewSlots;
}

export function InvoicePreview({ preview }: InvoicePreviewProps) {
  const { watch } = useFormContext<InvoiceSchema>();
  const { company, client, invoice, items, additionalInfo } = watch();
  const themeColor = invoice.themeColor;

  const { subtotal, billings, total } = computeInvoiceTotals(
    items,
    invoice.billingDetails,
  );
  const invoiceNumber = `${invoice.invoicePrefix ?? ""}${invoice.serialNumber}`;

  const hasFooter =
    additionalInfo.notes.trim().length > 0 ||
    additionalInfo.terms.trim().length > 0 ||
    additionalInfo.paymentInformation.length > 0;

  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) {
      return;
    }
    setScale(el.clientWidth / A4_WIDTH_PX);
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / A4_WIDTH_PX);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="bg-muted/40 sticky top-4 h-[calc(100vh-2rem)] overflow-auto rounded-lg p-6">
      <div ref={frameRef} className="mx-auto w-full max-w-[640px]">
        <article
          className="bg-card text-card-foreground shadow-xl"
          style={{
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
            zoom: scale ?? 1,
            visibility: scale === null ? "hidden" : "visible",
          }}
        >
          <div className="h-2" style={{ backgroundColor: themeColor }} />

          <div className="px-14 py-12 text-[13px]">
            <header className="flex items-start justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Factura</h2>
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={140}
                  height={42}
                  className="max-h-10 w-auto object-contain"
                />
              ) : (
                <span
                  className="text-base font-bold"
                  style={{ color: themeColor }}
                >
                  {company.name}
                </span>
              )}
            </header>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              <dt className="font-semibold">No. de factura</dt>
              <dd>{invoiceNumber}</dd>

              <dt className="font-semibold">Fecha de emisión</dt>
              <dd>{formatDate(invoice.invoiceDate)}</dd>

              {invoice.dueDate && (
                <>
                  <dt className="font-semibold">Fecha de vencimiento</dt>
                  <dd>{formatDate(invoice.dueDate)}</dd>
                </>
              )}

              {invoice.paymentTerms && (
                <>
                  <dt className="font-semibold">Condiciones de pago</dt>
                  <dd>{invoice.paymentTerms}</dd>
                </>
              )}

              {preview?.header && <preview.header />}
            </dl>

            <section className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-muted-foreground mt-1 leading-relaxed whitespace-pre-line">
                  {company.address}
                </p>
                {(company.email ||
                  company.phone ||
                  company.metadata.length > 0) && (
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    {company.email && <li>{company.email}</li>}
                    {company.phone && <li>{company.phone}</li>}
                    {company.metadata.map((m, i) => (
                      <li key={i}>
                        <span className="font-medium">{m.label}:</span>{" "}
                        {m.value}
                      </li>
                    ))}
                  </ul>
                )}
                {preview?.company && <preview.company />}
              </div>

              <div>
                <p className="font-semibold">Facturar a</p>
                <p className="mt-1">{client.name}</p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {client.address}
                </p>
                {(client.email ||
                  client.phone ||
                  client.metadata.length > 0) && (
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    {client.email && <li>{client.email}</li>}
                    {client.phone && <li>{client.phone}</li>}
                    {client.metadata.map((m, i) => (
                      <li key={i}>
                        <span className="font-medium">{m.label}:</span>{" "}
                        {m.value}
                      </li>
                    ))}
                  </ul>
                )}
                {preview?.client && <preview.client />}
              </div>
            </section>

            <h3 className="mt-8 text-lg font-bold">
              {formatCurrency(total, invoice.currency)}
              {invoice.dueDate
                ? ` adeudado al ${formatDate(invoice.dueDate)}`
                : ""}
            </h3>

            <table className="mt-6 w-full text-left">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs font-semibold">
                  <th className="py-2 pr-2 font-semibold">Descripción</th>
                  <th className="py-2 pr-2 text-right font-semibold">
                    Cantidad
                  </th>
                  <th className="py-2 pr-2 text-right font-semibold">
                    Precio unit.
                  </th>
                  <th className="py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground py-6 text-center"
                    >
                      Sin items
                    </td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={i} className="border-border border-b align-top">
                      <td className="py-3 pr-2">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-2 text-right">{item.quantity}</td>
                      <td className="py-3 pr-2 text-right">
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(
                          item.quantity * item.unitPrice,
                          invoice.currency,
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <section className="mt-4 ml-auto w-full max-w-xs">
              <div className="border-border flex justify-between border-b py-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              {billings.map((b, i) => (
                <div
                  key={i}
                  className="border-border flex justify-between border-b py-2"
                >
                  <span>
                    {b.label}
                    {b.type === "percentage" ? ` (${b.value}%)` : ""}
                  </span>
                  <span>{formatCurrency(b.amount, invoice.currency)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total, invoice.currency)}</span>
              </div>
            </section>

            {hasFooter && (
              <footer className="border-border mt-8 space-y-4 border-t pt-6">
                {additionalInfo.notes.trim().length > 0 && (
                  <div>
                    <p className="font-semibold">Notas</p>
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">
                      {additionalInfo.notes}
                    </p>
                  </div>
                )}
                {additionalInfo.terms.trim().length > 0 && (
                  <div>
                    <p className="font-semibold">Términos</p>
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">
                      {additionalInfo.terms}
                    </p>
                  </div>
                )}
                {additionalInfo.paymentInformation.length > 0 && (
                  <div>
                    <p className="font-semibold">Información de pago</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      {additionalInfo.paymentInformation.map((p, i) => (
                        <li key={i}>
                          <span className="font-medium">{p.label}:</span>{" "}
                          {p.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </footer>
            )}

            {company.signature && (
              <div className="mt-8 flex flex-col items-end">
                <Image
                  src={company.signature}
                  alt="Firma"
                  width={140}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Firma autorizada
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
