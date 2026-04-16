"use client";

import { useFormContext } from "react-hook-form";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function CompanyDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceSchema>();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Nombre de la empresa</FieldLabel>
        <Input
          {...register("company.name")}
          autoComplete="off"
          placeholder="Factura Simple S. de R.L."
        />
        <FieldError errors={[errors.company?.name]} />
      </Field>
      <Field>
        <FieldLabel>Dirección de la empresa</FieldLabel>
        <Input
          {...register("company.address")}
          autoComplete="off"
          placeholder="Col. Los Pinos, Bloque 5, Casa 5"
        />
        <FieldError errors={[errors.company?.address]} />
      </Field>
    </FieldGroup>
  );
}
