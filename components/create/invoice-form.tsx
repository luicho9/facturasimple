"use client";

import {
  invoiceSchema,
  InvoiceSchema,
  invoiceSchemaDefaultValues,
} from "@/lib/schemas/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

interface InvoiceFormProps {
  children: React.ReactNode;
  defaults: InvoiceSchema;
}

export function InvoiceForm({ children, defaults }: InvoiceFormProps) {
  const form = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaults,
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}
