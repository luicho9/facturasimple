"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function InvoiceItems() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InvoiceSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <FieldGroup>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-3 rounded-lg border p-4"
        >
          <Field>
            <FieldLabel>Nombre</FieldLabel>
            <Input
              {...register(`items.${index}.name`)}
              autoComplete="off"
              placeholder="Servicio de consultoría"
            />
            <FieldError errors={[errors.items?.[index]?.name]} />
          </Field>

          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <Input
              {...register(`items.${index}.description`)}
              autoComplete="off"
              placeholder="Descripción del servicio"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Cantidad</FieldLabel>
              <Input
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                type="number"
                min="1"
                step="1"
                autoComplete="off"
              />
              <FieldError errors={[errors.items?.[index]?.quantity]} />
            </Field>

            <Field>
              <FieldLabel>Precio unitario</FieldLabel>
              <Input
                {...register(`items.${index}.unitPrice`, {
                  valueAsNumber: true,
                })}
                type="number"
                min="0"
                step="0.01"
                autoComplete="off"
              />
              <FieldError errors={[errors.items?.[index]?.unitPrice]} />
            </Field>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => remove(index)}
          >
            Eliminar
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ name: "", description: "", quantity: 1, unitPrice: 0 })
        }
      >
        Agregar item
      </Button>
    </FieldGroup>
  );
}
