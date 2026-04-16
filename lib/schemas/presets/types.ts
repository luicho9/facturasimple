import type { InvoiceSchema } from "../invoice";
import type { z } from "zod";

export type PresetPreviewSlots = {
  header?: React.ComponentType;
  company?: React.ComponentType;
  client?: React.ComponentType;
  footer?: React.ComponentType;
};

export type PresetPdfSlotProps = { data: unknown };

export type PresetPdfSlots = {
  header?: React.ComponentType<PresetPdfSlotProps>;
  company?: React.ComponentType<PresetPdfSlotProps>;
  client?: React.ComponentType<PresetPdfSlotProps>;
  footer?: React.ComponentType<PresetPdfSlotProps>;
};

export type Preset = {
  label: string;
  invoiceDefaults: InvoiceSchema;
  fieldsSchema?: z.ZodTypeAny;
  FormFields?: React.ComponentType;
  preview?: PresetPreviewSlots;
  pdf?: PresetPdfSlots;
};
