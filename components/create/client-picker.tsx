"use client";

import { useFormContext } from "react-hook-form";
import type { Client } from "@/lib/db/schema";
import type { InvoiceSchema } from "@/lib/schemas/invoice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientPickerProps {
  clients: Client[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const NEW_CLIENT = "__new__";

export function ClientPicker({
  clients,
  selectedId,
  onSelect,
}: ClientPickerProps) {
  const { setValue } = useFormContext<InvoiceSchema>();

  if (clients.length === 0) {
    return null;
  }

  function setClientValues(values: InvoiceSchema["client"]) {
    setValue("client.name", values.name, { shouldDirty: true });
    setValue("client.address", values.address, { shouldDirty: true });
    setValue("client.email", values.email, { shouldDirty: true });
    setValue("client.phone", values.phone, { shouldDirty: true });
    setValue("client.metadata", values.metadata, { shouldDirty: true });
  }

  function handleChange(value: string) {
    if (value === NEW_CLIENT) {
      onSelect(null);
      setClientValues({
        name: "",
        address: "",
        email: "",
        phone: "",
        metadata: [],
      });
      return;
    }
    const match = clients.find((c) => c.id === value);

    if (!match) {
      return;
    }

    onSelect(match.id);
    setClientValues({
      name: match.name,
      address: match.address,
      email: match.email,
      phone: match.phone,
      metadata: Array.isArray(match.metadata)
        ? (match.metadata as InvoiceSchema["client"]["metadata"])
        : [],
    });
  }

  return (
    <div className="flex items-center justify-between px-1 pb-3">
      <span className="text-sm text-muted-foreground">Cliente guardado</span>
      <Select value={selectedId ?? NEW_CLIENT} onValueChange={handleChange}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Nuevo cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={NEW_CLIENT}>Nuevo cliente</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
