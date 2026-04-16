"use client";

import { StyleSheet, Text } from "@react-pdf/renderer";
import type { PresetPdfSlotProps } from "../../types";
import type { HnFields } from "../schema";

const styles = StyleSheet.create({
  text: { color: "#6b7280", marginTop: 2 },
  label: { fontFamily: "Helvetica-Bold" },
});

export function HnPdfCompany({ data }: PresetPdfSlotProps) {
  const fields = data as HnFields | undefined;
  const rtn = fields?.rtnEmpresa;
  if (!rtn) return null;
  return (
    <Text style={styles.text}>
      <Text style={styles.label}>RTN: </Text>
      {rtn}
    </Text>
  );
}
