export function medianTatHours(
  items: { start: string; end: string | null | undefined }[],
): number | null {
  const diffs = items
    .filter((x) => !!x.end)
    .map(
      (x) =>
        (new Date(x.end as string).getTime() - new Date(x.start).getTime()) /
        3_600_000,
    )
    .filter((h) => Number.isFinite(h) && h >= 0)
    .sort((a, b) => a - b);
  if (!diffs.length) return null;
  const mid = Math.floor(diffs.length / 2);
  return diffs.length % 2 ? diffs[mid] : (diffs[mid - 1] + diffs[mid]) / 2;
}

export function slaBreachCount(
  items: { start: string; end: string | null | undefined }[],
  slaHours = 24,
): number {
  const now = Date.now();
  return items.filter((x) => {
    const endMs = x.end ? new Date(x.end).getTime() : now;
    return (endMs - new Date(x.start).getTime()) / 3_600_000 > slaHours;
  }).length;
}

export function formatHours(h: number | null): string {
  if (h === null) return "—";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}