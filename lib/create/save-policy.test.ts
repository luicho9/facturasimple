import { describe, expect, test } from "vitest";
import { invoiceSchemaDefaultValues } from "@/lib/schemas/invoice";
import { hnInvoiceDefaults } from "@/lib/schemas/presets/hn/schema";
import { getInvoiceSaveDecision } from "./save-policy";

describe("getInvoiceSaveDecision", () => {
  test("skips saving invalid invoice data with a clean message", () => {
    const invoice = {
      ...invoiceSchemaDefaultValues,
      company: {
        ...invoiceSchemaDefaultValues.company,
        address: "",
      },
    };

    expect(() =>
      getInvoiceSaveDecision({ canAttemptSave: true, invoice }),
    ).not.toThrow();
    expect(getInvoiceSaveDecision({ canAttemptSave: true, invoice })).toEqual({
      action: "skip",
      message:
        "PDF descargado sin guardarse. Completa los datos requeridos para guardar la factura.",
    });
  });

  test("allows saving Honduran invoice numbers as strings", () => {
    const decision = getInvoiceSaveDecision({
      canAttemptSave: true,
      invoice: hnInvoiceDefaults,
    });

    expect(decision.action).toBe("save");
    if (decision.action === "save") {
      expect(decision.invoice.invoice.invoiceNumber).toBe(
        "000-001-01-00000001",
      );
    }
  });
});
