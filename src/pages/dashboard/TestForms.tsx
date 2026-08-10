import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Search, ArrowRight, Plus, Loader2, Printer, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TestStatus } from "@/lib/labCatalog";
import { useQuery } from "@tanstack/react-query";
import { fetchTestForms } from "@/lib/supabaseQueries";
import { printTestForm } from "@/lib/printTestForm";
import { DateRangeFilter, DateRange, dateRangeCutoff, inRange } from "@/components/common/DateRangeFilter";
import { downloadCsv } from "@/lib/csvExport";
import { useRealtime } from "@/lib/useRealtime";

type Filter = "all" | TestStatus;

const TestForms = ({ defaultFilter = "all" as Filter, title = "Test Forms", subtitle = "All laboratory test forms" }) => {
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["test_forms"],
    queryFn: fetchTestForms,
  });
  useRealtime("test_forms", [["test_forms"]]);
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [range, setRange] = useState<DateRange>("30d");

  const filtered = useMemo(() => {
    const cutoff = dateRangeCutoff(range);
    return forms.filter((f) => {
      const matchQ = !q ||
        f.serial.toLowerCase().includes(q.toLowerCase()) ||
        f.patient_name.toLowerCase().includes(q.toLowerCase());
      const matchF = filter === "all" || f.status === filter;
      const matchD = inRange(f.date_collected, cutoff);
      return matchQ && matchF && matchD;
    });
  }, [forms, q, filter, range]);

  const exportCsv = () =>
    downloadCsv(
      `test-forms-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((f) => ({
        serial: f.serial,
        patient_name: f.patient_name,
        age: f.age,
        gender: f.gender,
        phone: f.phone ?? "",
        referred_by: f.referred_by,
        date_collected: f.date_collected,
        tests_requested: f.tests_requested.join("; "),
        status: f.status,
        completed_at: f.completed_at ?? "",
        bill: f.bill,
      })),
    );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search serial or patient…" className="pl-9 rounded-full" />
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button asChild variant="hero" size="sm" className="shrink-0">
            <Link to="/dashboard/forms/new"><Plus className="h-4 w-4" /> New Form</Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/60 shadow-soft">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList>
                <TabsTrigger value="all">All ({forms.length})</TabsTrigger>
                <TabsTrigger value="Pending">Pending ({forms.filter(f => f.status === "Pending").length})</TabsTrigger>
                <TabsTrigger value="Processing">Processing ({forms.filter(f => f.status === "Processing").length})</TabsTrigger>
                <TabsTrigger value="Completed">Completed ({forms.filter(f => f.status === "Completed").length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold">Serial No.</TableHead>
                    <TableHead className="font-semibold">Patient</TableHead>
                    <TableHead className="font-semibold">Tests Requested</TableHead>
                    <TableHead className="font-semibold">Date Collected</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No matching test forms.
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((f) => (
                    <TableRow key={f.serial}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{f.serial}</TableCell>
                      <TableCell>
                        <p className="font-medium">{f.patient_name}</p>
                        <p className="text-xs text-muted-foreground">{f.age}y · {f.gender}</p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{f.tests_requested.join(", ")}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(f.date_collected).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </TableCell>
                      <TableCell><StatusBadge status={f.status as TestStatus} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => printTestForm(f)} title="Print test form">
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                          <Button asChild variant="soft" size="sm">
                            <Link to={`/dashboard/forms/${f.serial}`}>
                              Open Form <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TestForms;
