"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/lib/currencies";
import { presets, type PresetKey } from "@/lib/schemas/presets/registry";
import { companySchema, type CompanySchema } from "@/lib/schemas/company";
import { updateCompany } from "@/app/(dashboard)/company/actions";
import { AssetUploader } from "@/components/company/asset-uploader";

interface CompanyFormProps {
  defaults: CompanySchema;
}

export function CompanyForm({ defaults }: CompanyFormProps) {
  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: defaults,
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = form;
  const [logoUrl, setLogoUrl] = useState<string | null>(defaults.logoUrl);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(
    defaults.signatureUrl,
  );
  const presetOptions = Object.entries(presets);
  const selectedPresetKey = useWatch({
    control,
    name: "defaultPreset",
    defaultValue: defaults.defaultPreset,
  }) as PresetKey;
  const selectedPreset = presets[selectedPresetKey] ?? presets.default;
  const PresetFormFields = selectedPreset?.FormFields;

  async function onSubmit(values: CompanySchema) {
    try {
      await updateCompany({ ...values, logoUrl, signatureUrl });
      reset({ ...values, logoUrl, signatureUrl });
      toast.success("Cambios guardados");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="rounded-md border p-4">
          <Field>
            <FieldLabel>Plantilla</FieldLabel>
            <Controller
              control={control}
              name="defaultPreset"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.defaultPreset]} />
          </Field>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="identity"
          className="rounded-md border"
        >
          <AccordionItem value="identity">
            <AccordionTrigger className="px-4">
              Datos de la empresa
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre de la empresa</FieldLabel>
                  <Input
                    {...register("name")}
                    autoComplete="off"
                    placeholder="Factura Simple S. de R.L."
                  />
                  <FieldError errors={[errors.name]} />
                </Field>
                <Field>
                  <FieldLabel>Dirección</FieldLabel>
                  <Input
                    {...register("address")}
                    autoComplete="off"
                    placeholder="Col. Los Pinos, Bloque 5, Casa 5"
                  />
                  <FieldError errors={[errors.address]} />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...register("email")}
                    type="email"
                    autoComplete="off"
                    placeholder="contacto@empresa.com"
                  />
                  <FieldError errors={[errors.email]} />
                </Field>
                <Field>
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input
                    {...register("phone")}
                    type="tel"
                    autoComplete="off"
                    placeholder="+504 0000-0000"
                  />
                  <FieldError errors={[errors.phone]} />
                </Field>
                <Field>
                  <FieldLabel>Logo</FieldLabel>
                  <AssetUploader
                    kind="logo"
                    label="Logo"
                    url={logoUrl}
                    onChange={setLogoUrl}
                  />
                </Field>
                <Field>
                  <FieldLabel>Firma</FieldLabel>
                  <AssetUploader
                    kind="signature"
                    label="Firma"
                    url={signatureUrl}
                    onChange={setSignatureUrl}
                  />
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="invoice-defaults">
            <AccordionTrigger className="px-4">
              Valores por defecto para facturas
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Moneda</FieldLabel>
                  <Controller
                    control={control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.defaultCurrency]} />
                </Field>
                <Field>
                  <FieldLabel>Color del tema</FieldLabel>
                  <Input {...register("defaultThemeColor")} type="color" />
                  <FieldError errors={[errors.defaultThemeColor]} />
                </Field>
                <Field>
                  <FieldLabel>Prefijo para facturas simples</FieldLabel>
                  <Input {...register("invoicePrefix")} placeholder="FAC-" />
                  <FieldError errors={[errors.invoicePrefix]} />
                </Field>
                <Field>
                  <FieldLabel>Términos de pago</FieldLabel>
                  <Input
                    {...register("defaultPaymentTerms")}
                    placeholder="Net 30"
                  />
                  <FieldError errors={[errors.defaultPaymentTerms]} />
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          {PresetFormFields && (
            <AccordionItem value="preset-fields">
              <AccordionTrigger className="px-4">
                Datos fiscales ({selectedPreset.label})
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <PresetFormFields pathPrefix="defaultPresetFields" />
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="texts">
            <AccordionTrigger className="px-4">
              Textos reutilizables
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Notas por defecto</FieldLabel>
                  <textarea
                    {...register("defaultNotes")}
                    placeholder="Gracias por su compra."
                    rows={3}
                    className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                  <FieldError errors={[errors.defaultNotes]} />
                </Field>
                <Field>
                  <FieldLabel>Términos por defecto</FieldLabel>
                  <textarea
                    {...register("defaultTerms")}
                    placeholder="Términos y condiciones de la factura."
                    rows={3}
                    className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                  <FieldError errors={[errors.defaultTerms]} />
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
