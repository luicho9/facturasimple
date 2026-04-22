"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { client, company, invoice } from "@/lib/db/schema";
import { invoiceSchema, type InvoiceSchema } from "@/lib/schemas/invoice";
import { computeInvoiceTotals } from "@/lib/billing";

type SaveInvoiceResult =
  | { ok: true; id: string; invoiceNumber: string }
  | { ok: false; message: string };

export async function saveInvoice(
  payload: InvoiceSchema,
  clientId: string | null,
): Promise<SaveInvoiceResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { ok: false, message: "Inicia sesión para guardar facturas" };
  }

  const result = invoiceSchema.safeParse(payload);
  if (!result.success) {
    return {
      ok: false,
      message: "Completa los datos requeridos para guardar la factura",
    };
  }

  const parsed = result.data;
  const totals = computeInvoiceTotals(
    parsed.items,
    parsed.invoice.billingDetails,
  );
  const invoiceNumber = parsed.invoice.invoiceNumber;

  const [companyRow] = await db
    .select({ userId: company.userId })
    .from(company)
    .where(eq(company.userId, session.user.id))
    .limit(1);

  if (!companyRow) {
    return {
      ok: false,
      message: "Configura tu empresa para guardar facturas",
    };
  }

  const [duplicate] = await db
    .select({ id: invoice.id })
    .from(invoice)
    .where(
      and(
        eq(invoice.userId, session.user.id),
        eq(invoice.invoiceNumber, invoiceNumber),
      ),
    )
    .limit(1);

  if (duplicate) {
    return { ok: false, message: "Ya existe una factura con ese número" };
  }

  if (clientId) {
    const [clientRow] = await db
      .select({ id: client.id })
      .from(client)
      .where(and(eq(client.id, clientId), eq(client.userId, session.user.id)))
      .limit(1);

    if (!clientRow) {
      return { ok: false, message: "Cliente inválido" };
    }
  }

  const [row] = await db
    .insert(invoice)
    .values({
      userId: session.user.id,
      clientId,
      invoiceNumber,
      invoiceDate: parsed.invoice.invoiceDate,
      dueDate: parsed.invoice.dueDate ?? null,
      totalAmount: totals.total.toFixed(2),
      currency: parsed.invoice.currency,
      payload: parsed,
    })
    .returning({ id: invoice.id });

  revalidatePath("/invoices");
  return { ok: true, id: row.id, invoiceNumber };
}
