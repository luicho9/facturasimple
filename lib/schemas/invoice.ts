import { z } from "zod";

export const invoiceSchema = z.object({
  company: z.object({
    logo: z.string().nullable().optional(),
    signature: z.string().nullable().optional(),
    name: z.string().min(1, "El nombre de la empresa es requerido"),
    address: z.string().min(1, "La dirección de la empresa es requerida"),
    email: z.email("Email inválido").or(z.literal("")).optional(),
    phone: z.string().optional(),
    metadata: z.array(
      z.object({
        label: z.string().min(1, "La etiqueta no puede estar vacía"),
        value: z.string().min(1, "El valor no puede estar vacío"),
      }),
    ),
  }),
  client: z.object({
    name: z.string().min(1, "El nombre del cliente es requerido"),
    address: z.string().min(1, "La dirección del cliente es requerida"),
    email: z.email("Email inválido").or(z.literal("")).optional(),
    phone: z.string().optional(),
    metadata: z.array(
      z.object({
        label: z.string().min(1, "La etiqueta no puede estar vacía"),
        value: z.string().min(1, "El valor no puede estar vacío"),
      }),
    ),
  }),
  invoice: z.object({
    currency: z.string().min(1, "La moneda es requerida"),
    themeColor: z.string().min(1, "El color del tema es requerido"),
    invoicePrefix: z
      .string()
      .min(1, "El prefijo de la factura no puede estar vacío")
      .optional(),
    serialNumber: z.string().min(1, "El número de serie es requerido"),
    invoiceDate: z.date(),
    dueDate: z.date().optional().nullable(),
    paymentTerms: z.string(),
    billingDetails: z.array(
      z.object({
        label: z.string().min(1, "La etiqueta no puede estar vacía"),
        type: z.enum(["percentage", "fixed"], {
          message: "El tipo debe ser 'percentage' o 'fixed'",
        }),
        value: z.number(),
      }),
    ),
  }),
  items: z.array(
    z.object({
      name: z.string().min(1, "El nombre del item es requerido"),
      description: z.string(),
      quantity: z.number().positive("La cantidad debe ser positiva"),
      unitPrice: z.number().positive("El precio unitario debe ser positivo"),
    }),
  ),
  additionalInfo: z.object({
    notes: z.string(),
    terms: z.string(),
    paymentInformation: z.array(
      z.object({
        label: z.string().min(1, "La etiqueta no puede estar vacía"),
        value: z.string().min(1, "El valor no puede estar vacío"),
      }),
    ),
  }),
  presetFields: z.any().optional(),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;

export const invoiceSchemaDefaultValues: InvoiceSchema = {
  company: {
    name: "Factura Simple S. de R.L.",
    address: "Col. Los Pinos, Bloque 5, Casa 5",
    email: "",
    phone: "",
    metadata: [],
  },
  client: {
    name: "Juan Pérez",
    address: "Col. Los Alamos, Bloque 10, Casa 10",
    email: "",
    phone: "",
    metadata: [],
  },
  invoice: {
    currency: "HNL",
    themeColor: "#00786f",
    serialNumber: "0001",
    invoiceDate: new Date(),
    dueDate: null,
    paymentTerms: "",
    billingDetails: [],
  },
  items: [],
  additionalInfo: {
    notes: "",
    terms: "",
    paymentInformation: [],
  },
  presetFields: {},
};
