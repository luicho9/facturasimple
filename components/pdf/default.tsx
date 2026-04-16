"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import type { PresetPdfSlots } from "@/lib/schemas/presets/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { computeInvoiceTotals } from "@/lib/billing";

const COLORS = {
  text: "#0a0a0a",
  muted: "#6b7280",
  border: "#e5e7eb",
  card: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  themeStripe: { height: 8, width: "100%" },
  body: { paddingHorizontal: 56, paddingVertical: 48 },

  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  logo: { maxHeight: 40, objectFit: "contain" },
  companyName: { fontSize: 13, fontFamily: "Helvetica-Bold" },

  metaList: { marginTop: 24, gap: 4 },
  metaRow: { flexDirection: "row" },
  metaLabel: { width: 140, fontFamily: "Helvetica-Bold" },

  parties: { marginTop: 24, flexDirection: "row", gap: 24 },
  party: { flex: 1 },
  partyLabel: { fontFamily: "Helvetica-Bold" },
  partyClientName: { marginTop: 4 },
  muted: { color: COLORS.muted },
  metaItem: { color: COLORS.muted, marginTop: 2 },
  metaItemLabel: { fontFamily: "Helvetica-Bold" },

  totalLine: { marginTop: 32, fontSize: 13, fontFamily: "Helvetica-Bold" },

  table: { marginTop: 24 },
  thead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    fontSize: 9,
    color: COLORS.muted,
    fontFamily: "Helvetica-Bold",
  },
  thDescription: { flex: 1, paddingRight: 8 },
  thQuantity: { width: 60, paddingRight: 8, textAlign: "right" },
  thUnitPrice: { width: 80, paddingRight: 8, textAlign: "right" },
  thTotal: { width: 80, textAlign: "right" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
  },
  cellDescription: { flex: 1, paddingRight: 8 },
  itemName: { fontFamily: "Helvetica-Bold" },
  itemDescription: { color: COLORS.muted, fontSize: 9, marginTop: 2 },
  cellQuantity: { width: 60, paddingRight: 8, textAlign: "right" },
  cellUnitPrice: { width: 80, paddingRight: 8, textAlign: "right" },
  cellTotal: { width: 80, textAlign: "right" },
  emptyRow: { paddingVertical: 24, textAlign: "center", color: COLORS.muted },

  totals: { marginTop: 16, marginLeft: "auto", width: 220 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    fontFamily: "Helvetica-Bold",
  },

  footer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 24,
  },
  footerBlock: { marginBottom: 16 },
  footerLabel: { fontFamily: "Helvetica-Bold" },
  footerText: { color: COLORS.muted, marginTop: 4 },

  signatureBlock: { marginTop: 32, alignItems: "flex-end" },
  signatureImage: { height: 48, objectFit: "contain" },
  signatureLabel: { color: COLORS.muted, fontSize: 9, marginTop: 4 },
});

interface DefaultInvoicePdfProps {
  data: InvoiceSchema;
  pdfSlots?: PresetPdfSlots;
}

export function DefaultInvoicePdf({ data, pdfSlots }: DefaultInvoicePdfProps) {
  const { company, client, invoice, items, additionalInfo } = data;
  const themeColor = invoice.themeColor;
  const presetFields = data.presetFields;

  const { subtotal, billings, total } = computeInvoiceTotals(
    items,
    invoice.billingDetails,
  );
  const invoiceNumber = `${invoice.invoicePrefix ?? ""}${invoice.serialNumber}`;

  const hasFooter =
    additionalInfo.notes.trim().length > 0 ||
    additionalInfo.terms.trim().length > 0 ||
    additionalInfo.paymentInformation.length > 0;

  return (
    <Document
      title={`Factura-${invoiceNumber}`}
      author={company.name}
      subject={`Factura para ${client.name}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={[styles.themeStripe, { backgroundColor: themeColor }]} />

        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.title}>Factura</Text>
            {company.logo ? (
              <Image src={company.logo} style={styles.logo} />
            ) : (
              <Text style={[styles.companyName, { color: themeColor }]}>
                {company.name}
              </Text>
            )}
          </View>

          <View style={styles.metaList}>
            <MetaRow label="No. de factura" value={invoiceNumber} />
            <MetaRow
              label="Fecha de emisión"
              value={formatDate(invoice.invoiceDate)}
            />
            {invoice.dueDate && (
              <MetaRow
                label="Fecha de vencimiento"
                value={formatDate(invoice.dueDate)}
              />
            )}
            {invoice.paymentTerms && (
              <MetaRow
                label="Condiciones de pago"
                value={invoice.paymentTerms}
              />
            )}
            {pdfSlots?.header && <pdfSlots.header data={presetFields} />}
          </View>

          <View style={styles.parties}>
            <View style={styles.party}>
              <Text style={styles.partyLabel}>{company.name}</Text>
              <Text style={[styles.muted, { marginTop: 4 }]}>{company.address}</Text>
              {company.email && (
                <Text style={styles.metaItem}>{company.email}</Text>
              )}
              {company.phone && (
                <Text style={styles.metaItem}>{company.phone}</Text>
              )}
              {company.metadata.map((m, i) => (
                <Text key={i} style={styles.metaItem}>
                  <Text style={styles.metaItemLabel}>{m.label}: </Text>
                  {m.value}
                </Text>
              ))}
              {pdfSlots?.company && <pdfSlots.company data={presetFields} />}
            </View>

            <View style={styles.party}>
              <Text style={styles.partyLabel}>Facturar a</Text>
              <Text style={styles.partyClientName}>{client.name}</Text>
              <Text style={styles.muted}>{client.address}</Text>
              {client.email && (
                <Text style={styles.metaItem}>{client.email}</Text>
              )}
              {client.phone && (
                <Text style={styles.metaItem}>{client.phone}</Text>
              )}
              {client.metadata.map((m, i) => (
                <Text key={i} style={styles.metaItem}>
                  <Text style={styles.metaItemLabel}>{m.label}: </Text>
                  {m.value}
                </Text>
              ))}
              {pdfSlots?.client && <pdfSlots.client data={presetFields} />}
            </View>
          </View>

          <Text style={styles.totalLine}>
            {formatCurrency(total, invoice.currency)}
            {invoice.dueDate
              ? ` adeudado al ${formatDate(invoice.dueDate)}`
              : ""}
          </Text>

          <View style={styles.table}>
            <View style={styles.thead}>
              <Text style={styles.thDescription}>Descripción</Text>
              <Text style={styles.thQuantity}>Cantidad</Text>
              <Text style={styles.thUnitPrice}>Precio unit.</Text>
              <Text style={styles.thTotal}>Total</Text>
            </View>

            {items.length === 0 ? (
              <Text style={styles.emptyRow}>Sin items</Text>
            ) : (
              items.map((item, i) => (
                <View key={i} style={styles.row} wrap={false}>
                  <View style={styles.cellDescription}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.itemDescription}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.cellQuantity}>{item.quantity}</Text>
                  <Text style={styles.cellUnitPrice}>
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </Text>
                  <Text style={styles.cellTotal}>
                    {formatCurrency(
                      item.quantity * item.unitPrice,
                      invoice.currency,
                    )}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(subtotal, invoice.currency)}</Text>
            </View>
            {billings.map((b, i) => (
              <View key={i} style={styles.totalRow}>
                <Text>
                  {b.label}
                  {b.type === "percentage" ? ` (${b.value}%)` : ""}
                </Text>
                <Text>{formatCurrency(b.amount, invoice.currency)}</Text>
              </View>
            ))}
            <View style={styles.totalRowFinal}>
              <Text>Total</Text>
              <Text>{formatCurrency(total, invoice.currency)}</Text>
            </View>
          </View>

          {hasFooter && (
            <View style={styles.footer}>
              {additionalInfo.notes.trim().length > 0 && (
                <View style={styles.footerBlock}>
                  <Text style={styles.footerLabel}>Notas</Text>
                  <Text style={styles.footerText}>
                    {additionalInfo.notes}
                  </Text>
                </View>
              )}
              {additionalInfo.terms.trim().length > 0 && (
                <View style={styles.footerBlock}>
                  <Text style={styles.footerLabel}>Términos</Text>
                  <Text style={styles.footerText}>
                    {additionalInfo.terms}
                  </Text>
                </View>
              )}
              {additionalInfo.paymentInformation.length > 0 && (
                <View>
                  <Text style={styles.footerLabel}>Información de pago</Text>
                  {additionalInfo.paymentInformation.map((p, i) => (
                    <Text key={i} style={styles.footerText}>
                      <Text style={styles.metaItemLabel}>{p.label}: </Text>
                      {p.value}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {company.signature && (
            <View style={styles.signatureBlock}>
              <Image src={company.signature} style={styles.signatureImage} />
              <Text style={styles.signatureLabel}>Firma autorizada</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}
