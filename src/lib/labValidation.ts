import { LabField, LabSection } from "@/lib/labCatalog";

const isOutOfRange = (field: LabField, raw: string): boolean => {
  if (field.type !== "number" || !raw || !field.range) return false;
  const v = parseFloat(raw);
  if (isNaN(v)) return false;
  const r = field.range.replace(/,/g, ".");
  // patterns: "12.5 – 16", "< 5.17", "0 – 9 (W)"
  const ltMatch = r.match(/<\s*([\d.]+)/);
  if (ltMatch) return v >= parseFloat(ltMatch[1]);
  const gtMatch = r.match(/>\s*([\d.]+)/);
  if (gtMatch) return v <= parseFloat(gtMatch[1]);
  const rangeMatch = r.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1]);
    const hi = parseFloat(rangeMatch[2]);
    return v < lo || v > hi;
  }
  return false;
};

export const sectionHasValues = (section: LabSection, values: Record<string, string>) =>
  section.fields.some((f) => values[f.key] && values[f.key].trim() !== "");

export { isOutOfRange };
