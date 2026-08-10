import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Search, FileText, ArrowRight, Filter, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LAB_SECTIONS, TestStatus } from "@/lib/labCatalog";
import { useQuery } from "@tanstack/react-query";
import { fetchTestForms } from "@/lib/supabaseQueries";

const ResultsSearch = () => {
  const { data: allForms = [], isLoading } = useQuery({
    queryKey: ["test_forms"],
    queryFn: fetchTestForms,
  });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Processing">("all");

  const formsWithResults = useMemo(() => {
    return allForms.filter((f) => {
      const hasResults = f.status === "Completed" || f.status === "Processing";
      if (!hasResults) return false;
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      if (!matchStatus) return false;
      if (!q) return true;
      const lower = q.toLowerCase();
      return (
        f.serial.toLowerCase().includes(lower) ||
        f.patient_name.toLowerCase().includes(lower) ||
        f.tests_requested.some((t) => t.toLowerCase().includes(lower))
      );
    });
  }, [allForms, q, statusFilter]);

  const getFilledFields = (results?: Record<string, string>) => {
    if (!results) return 0;
    return Object.values(results).filter((v) => v && v.trim() !== "").length;
  };

  const getResultSummary = (results?: Record<string, string>) => {
    if (!results) return [];
    const entries: { label: string; value: string }[] = [];
    for (const section of LAB_SECTIONS) {
      for (const field of section.fields) {
        if (results[field.key] && results[field.key].trim()) {
          entries.push({ label: field.label, value: `${results[field.key]}${field.unit ? ` ${field.unit}` : ""}` });
        }
      }
    }
    return entries.slice(0, 6);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Results Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find and review lab results by patient, serial, or test type</p>
      </div>

      <Card className="border-border/60 shadow-soft mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by serial, patient name, or test…"
                className="pl-9 rounded-full"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "Completed", "Processing"] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {s === "all" ? "All Results" : s}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {formsWithResults.length === 0 ? (
            <Card className="border-border/60 shadow-soft">
              <CardContent className="text-center py-12">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground font-medium">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            formsWithResults.map((f) => {
              const results = f.results as Record<string, string> | undefined;
              const summary = getResultSummary(results);
              const filledCount = getFilledFields(results);
              return (
                <Card key={f.serial} className="border-border/60 shadow-soft hover:shadow-md transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-primary">{f.serial}</span>
                          <StatusBadge status={f.status as TestStatus} />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{f.patient_name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.age}y · {f.gender} · {f.tests_requested.join(", ")}
                        </p>
                        {f.completed_at && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Completed: {new Date(f.completed_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                        )}
                        {summary.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                            {summary.map((s) => (
                              <div key={s.label} className="text-xs">
                                <span className="text-muted-foreground">{s.label}: </span>
                                <span className="font-medium text-foreground">{s.value}</span>
                              </div>
                            ))}
                            {filledCount > 6 && (
                              <p className="text-[10px] text-muted-foreground col-span-full">
                                +{filledCount - 6} more fields
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <Button asChild variant="soft" size="sm" className="shrink-0">
                        <Link to={`/dashboard/forms/${f.serial}`}>
                          View Results <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResultsSearch;
