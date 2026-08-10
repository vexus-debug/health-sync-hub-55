import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchActivity } from "@/lib/scanQueries";
import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon } from "lucide-react";
import { DateRangeFilter, DateRange, dateRangeCutoff, inRange } from "@/components/common/DateRangeFilter";
import { useRealtime } from "@/lib/useRealtime";

const Activity = () => {
  const { data: items = [] } = useQuery({ queryKey: ["scan_activity"], queryFn: () => fetchActivity(200) });
  useRealtime("scan_activity", [["scan_activity"]]);
  const [q, setQ] = useState("");
  const [user, setUser] = useState("All");
  const [range, setRange] = useState<DateRange>("30d");

  const users = useMemo(
    () => Array.from(new Set(items.map((i) => i.user_name).filter(Boolean))) as string[],
    [items],
  );

  const filtered = useMemo(() => {
    const cutoff = dateRangeCutoff(range);
    return items.filter((it) => {
      if (!inRange(it.created_at, cutoff)) return false;
      if (user !== "All" && it.user_name !== user) return false;
      if (!q) return true;
      const hay = `${it.action} ${it.details ?? ""} ${it.user_name ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [items, q, user, range]);

  return (
    <ScanLayout>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div><h1 className="text-2xl font-bold">Activity</h1><p className="text-sm text-muted-foreground">{filtered.length} of {items.length}</p></div>
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search actions…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All users</SelectItem>
                {users.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <DateRangeFilter value={range} onChange={setRange} />
          </div>
        </div>
        <Card><CardContent className="p-0 divide-y">
          {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No activity.</p>}
          {filtered.map((it) => (
            <div key={it.id} className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary"><ActivityIcon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-medium">{it.user_name ?? "System"}</span> · {it.action}</p>
                {it.details && <p className="text-xs text-muted-foreground">{it.details}</p>}
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(it.created_at), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </CardContent></Card>
      </div>
    </ScanLayout>
  );
};
export default Activity;
