"use client";

import {
  invoiceSchema,
  InvoiceSchema,
  invoiceSchemaDefaultValues,
} from "@/lib/schemas/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

export function InvoiceForm({ children }: { children: React.ReactNode }) {
  const form = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceSchemaDefaultValues,
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}
