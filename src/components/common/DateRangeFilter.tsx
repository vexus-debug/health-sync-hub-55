import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startOfDay, subDays } from "date-fns";

export type DateRange = "7d" | "30d" | "90d" | "all";

export const dateRangeCutoff = (r: DateRange): Date | null => {
  if (r === "all") return null;
  const n = r === "7d" ? 7 : r === "30d" ? 30 : 90;
  return startOfDay(subDays(new Date(), n - 1));
};

export const inRange = (iso: string | null | undefined, cutoff: Date | null) =>
  !cutoff || (!!iso && new Date(iso) >= cutoff);

export function DateRangeFilter({
  value,
  onChange,
  className,
}: {
  value: DateRange;
  onChange: (v: DateRange) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
      <SelectTrigger className={className ?? "w-36"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
        <SelectItem value="all">All time</SelectItem>
      </SelectContent>
    </Select>
  );
}