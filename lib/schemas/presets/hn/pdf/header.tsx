"use client";

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PresetPdfSlotProps } from "../../types";
import type { HnFields } from "../schema";

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  label: { width: 140, fontFamily: "Helvetica-Bold" },
});

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-HN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
};

export function HnPdfHeader({ data }: PresetPdfSlotProps) {
  const fields = data as HnFields | undefined;
  if (!fields) return null;

  return (
    <>
      {fields.cai && (
        <View style={styles.row}>
          <Text style={styles.label}>CAI</Text>
          <Text>{fields.cai}</Text>
        </View>
      )}
      {fields.rangoAutorizado && (
        <View style={styles.row}>
          <Text style={styles.label}>Rango autorizado</Text>
          <Text>{fields.rangoAutorizado}</Text>
        </View>
      )}
      {fields.fechaLimiteEmision && (
        <View style={styles.row}>
          <Text style={styles.label}>Fecha límite de emisión</Text>
          <Text>{formatDate(fields.fechaLimiteEmision)}</Text>
        </View>
      )}
    </>
  );
}
