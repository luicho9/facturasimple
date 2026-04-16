"use client";

import { useFormContext } from "react-hook-form";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function ClientDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceSchema>();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Nombre del cliente</FieldLabel>
        <Input
          {...register("client.name")}
          autoComplete="off"
          placeholder="Juan Pérez"
        />
        <FieldError errors={[errors.client?.name]} />
      </Field>
      <Field>
        <FieldLabel>Dirección del cliente</FieldLabel>
        <Input
          {...register("client.address")}
          autoComplete="off"
          placeholder="Col. Los Pinos, Bloque 5, Casa 5"
        />
        <FieldError errors={[errors.client?.address]} />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          {...register("client.email")}
          type="email"
          autoComplete="off"
          placeholder="cliente@ejemplo.com"
        />
        <FieldError errors={[errors.client?.email]} />
      </Field>
      <Field>
        <FieldLabel>Teléfono</FieldLabel>
        <Input
          {...register("client.phone")}
          type="tel"
          autoComplete="off"
          placeholder="+504 0000-0000"
        />
        <FieldError errors={[errors.client?.phone]} />
      </Field>
    </FieldGroup>
  );
}
