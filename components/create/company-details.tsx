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
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          {...register("company.email")}
          type="email"
          autoComplete="off"
          placeholder="contacto@empresa.com"
        />
        <FieldError errors={[errors.company?.email]} />
      </Field>
      <Field>
        <FieldLabel>Teléfono</FieldLabel>
        <Input
          {...register("company.phone")}
          type="tel"
          autoComplete="off"
          placeholder="+504 0000-0000"
        />
        <FieldError errors={[errors.company?.phone]} />
      </Field>
    </FieldGroup>
  );
}
