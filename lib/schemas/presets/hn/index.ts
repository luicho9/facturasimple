import type { Preset } from "../types";
import { hnFieldsSchema, hnInvoiceDefaults } from "./schema";
import { HnFormFields } from "./form-fields";
import { HnHeaderPreview } from "./preview/header";
import { HnCompanyPreview } from "./preview/company";
import { HnClientPreview } from "./preview/client";
import { HnPdfHeader } from "./pdf/header";
import { HnPdfCompany } from "./pdf/company";
import { HnPdfClient } from "./pdf/client";

export const hn: Preset = {
  label: "Honduras",
  fieldsSchema: hnFieldsSchema,
  invoiceDefaults: hnInvoiceDefaults,
  FormFields: HnFormFields,
  preview: {
    header: HnHeaderPreview,
    company: HnCompanyPreview,
    client: HnClientPreview,
  },
  pdf: {
    header: HnPdfHeader,
    company: HnPdfCompany,
    client: HnPdfClient,
  },
};
