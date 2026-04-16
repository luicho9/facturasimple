interface BillingDetail {
  label: string;
  type: "percentage" | "fixed";
  value: number;
}

interface LineItem {
  quantity: number;
  unitPrice: number;
}

export interface ComputedBilling extends BillingDetail {
  amount: number;
}

export interface InvoiceTotals {
  subtotal: number;
  billings: ComputedBilling[];
  total: number;
}

export function computeInvoiceTotals(
  items: LineItem[],
  billingDetails: BillingDetail[],
): InvoiceTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const billings = billingDetails.map((detail) => ({
    ...detail,
    amount:
      detail.type === "percentage"
        ? subtotal * (detail.value / 100)
        : detail.value,
  }));

  const total = subtotal + billings.reduce((sum, b) => sum + b.amount, 0);

  return { subtotal, billings, total };
}
