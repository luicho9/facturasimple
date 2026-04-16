"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function AdditionalInformation() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InvoiceSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalInfo.paymentInformation",
  });

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Notas</FieldLabel>
        <textarea
          {...register("additionalInfo.notes")}
          className="min-h-[80px] w-full rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          placeholder="Notas adicionales para el cliente"
        />
      </Field>

      <Field>
        <FieldLabel>Términos y condiciones</FieldLabel>
        <textarea
          {...register("additionalInfo.terms")}
          className="min-h-[80px] w-full rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          placeholder="Términos y condiciones"
        />
      </Field>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          Información de pago
        </legend>

        <FieldGroup>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <Field>
                <FieldLabel>Etiqueta</FieldLabel>
                <Input
                  {...register(
                    `additionalInfo.paymentInformation.${index}.label`,
                  )}
                  autoComplete="off"
                  placeholder="Banco"
                />
                <FieldError
                  errors={[
                    errors.additionalInfo?.paymentInformation?.[index]?.label,
                  ]}
                />
              </Field>

              <Field>
                <FieldLabel>Valor</FieldLabel>
                <Input
                  {...register(
                    `additionalInfo.paymentInformation.${index}.value`,
                  )}
                  autoComplete="off"
                  placeholder="BAC Credomatic"
                />
                <FieldError
                  errors={[
                    errors.additionalInfo?.paymentInformation?.[index]?.value,
                  ]}
                />
              </Field>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
              >
                ✕
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ label: "", value: "" })}
          >
            Agregar nuevo campo
          </Button>
        </FieldGroup>
      </fieldset>
    </FieldGroup>
  );
}
