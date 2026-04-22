"use client";

import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface HnFormFieldsProps {
  pathPrefix?: string;
}

export function HnFormFields({ pathPrefix = "presetFields" }: HnFormFieldsProps = {}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const path = (key: string) => `${pathPrefix}.${key}` as Path<FieldValues>;
  const prefixErrors =
    (errors[pathPrefix as keyof typeof errors] as Record<string, { message?: string }> | undefined) ?? {};

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>RTN de la empresa</FieldLabel>
        <Input
          {...register(path("rtnEmpresa"))}
          autoComplete="off"
          placeholder="00000000000000"
          maxLength={14}
        />
        <FieldError errors={[prefixErrors.rtnEmpresa]} />
      </Field>

      <Field>
        <FieldLabel>RTN del cliente</FieldLabel>
        <Input
          {...register(path("rtnCliente"))}
          autoComplete="off"
          placeholder="00000000000000"
          maxLength={14}
        />
        <FieldError errors={[prefixErrors.rtnCliente]} />
      </Field>

      <Field>
        <FieldLabel>CAI</FieldLabel>
        <Input
          {...register(path("cai"))}
          autoComplete="off"
          placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX"
        />
        <FieldError errors={[prefixErrors.cai]} />
      </Field>

      <Field>
        <FieldLabel>Rango autorizado</FieldLabel>
        <Input
          {...register(path("rangoAutorizado"))}
          autoComplete="off"
          placeholder="000-001-01-00000001 al 000-001-01-00000500"
        />
        <FieldError errors={[prefixErrors.rangoAutorizado]} />
      </Field>

      <Field>
        <FieldLabel>Fecha límite de emisión</FieldLabel>
        <Controller
          control={control}
          name={path("fechaLimiteEmision")}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError errors={[prefixErrors.fechaLimiteEmision]} />
      </Field>
    </FieldGroup>
  );
}
