import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, ListChecks, ShieldAlert, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  LabInputType, LabTest, createLabTest, createTestCategory, deleteLabTest,
  fetchLabTests, fetchTestCategories, updateLabTest,
} from "@/lib/labTests";

const INPUT_TYPES: { value: LabInputType; label: string }[] = [
  { value: "number", label: "Number (with unit / range)" },
  { value: "text", label: "Short text" },
  { value: "select", label: "Choice list" },
  { value: "textarea", label: "Long text / report" },
];

const emptyDraft = {
  id: "",
  name: "",
  category_id: "",
  input_type: "number" as LabInputType,
  unit: "",
  reference_range: "",
  options: "",
  active: true,
};

const ManageTests = () => {
  const { isLabAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [draft, setDraft] = useState(emptyDraft);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const { data: categories = [] } = useQuery({ queryKey: ["test_categories"], queryFn: fetchTestCategories });
  const { data: tests = [], isLoading } = useQuery({ queryKey: ["lab_tests"], queryFn: fetchLabTests });

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  const filtered = useMemo(() => {
    return tests
      .filter((t) => (categoryFilter === "all" ? true : t.category_id === categoryFilter))
      .filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase()))
      .sort((a, b) => categoryName(a.category_id).localeCompare(categoryName(b.category_id)) || a.sort_order - b.sort_order);
  }, [tests, search, categoryFilter, categories]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["lab_tests"] });
    queryClient.invalidateQueries({ queryKey: ["test_categories"] });
  };

  const openNew = () => { setDraft(emptyDraft); setOpen(true); };
  const openEdit = (t: LabTest) => {
    setDraft({
      id: t.id,
      name: t.name,
      category_id: t.category_id ?? "",
      input_type: t.input_type,
      unit: t.unit ?? "",
      reference_range: t.reference_range ?? "",
      options: (t.options ?? []).join(", "),
      active: t.active,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name.trim()) { toast.error("Test name is required"); return; }
    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        category_id: draft.category_id || null,
        input_type: draft.input_type,
        unit: draft.unit.trim() || null,
        reference_range: draft.reference_range.trim() || null,
        options: draft.input_type === "select"
          ? draft.options.split(",").map((o) => o.trim()).filter(Boolean)
          : [],
        active: draft.active,
      };
      if (draft.id) {
        await updateLabTest(draft.id, payload);
        toast.success("Test updated");
      } else {
        await createLabTest({ ...payload, sort_order: tests.length + 1 });
        toast.success("Test added");
      }
      setOpen(false);
      refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save test");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t: LabTest) => {
    try {
      await updateLabTest(t.id, { active: !t.active });
      refresh();
      toast.success(t.active ? "Test deactivated" : "Test activated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not update test");
    }
  };

  const remove = async (t: LabTest) => {
    try {
      await deleteLabTest(t.id);
      refresh();
      toast.success("Test removed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not remove test");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createTestCategory(newCategory.trim(), categories.length + 1);
      setNewCategory("");
      refresh();
      toast.success("Category added");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not add category");
    }
  };

  if (loading) {
    return <DashboardLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  if (!isLabAdmin) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto mt-12 border-border/60">
          <CardContent className="text-center py-10 space-y-2">
            <ShieldAlert className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="font-semibold">Lab Admin only</p>
            <p className="text-sm text-muted-foreground">Managing test types is restricted to the Lab Admin account.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Manage Tests</h1>
          <p className="text-xs text-muted-foreground">Add, edit, deactivate or remove test types without developer help.</p>
        </div>
        <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" /> New Test</Button>
      </div>

      <Card className="mb-4 border-border/60 shadow-soft">
        <CardHeader className="pb-3"><CardTitle className="text-sm">Categories</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => <Badge key={c.id} variant="secondary" className="font-normal">{c.name}</Badge>)}
            {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
          </div>
          <div className="flex gap-2 max-w-md">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" className="h-9" />
            <Button variant="outline" onClick={addCategory}><Plus className="h-4 w-4" /> Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-soft">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <CardTitle className="text-sm">Test Types ({filtered.length})</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests…" className="h-9 pl-8 w-52" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left font-semibold px-3 py-2">Test</th>
                    <th className="text-left font-semibold px-3 py-2">Category</th>
                    <th className="text-left font-semibold px-3 py-2">Entry type</th>
                    <th className="text-left font-semibold px-3 py-2">Active</th>
                    <th className="text-right font-semibold px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-3 py-2">
                        <span className="font-medium">{t.name}</span>
                        {t.unit && <span className="ml-2 text-xs text-muted-foreground">{t.unit}</span>}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{categoryName(t.category_id)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{INPUT_TYPES.find((i) => i.value === t.input_type)?.label ?? t.input_type}</td>
                      <td className="px-3 py-2"><Switch checked={t.active} onCheckedChange={() => toggleActive(t)} /></td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove “{t.name}”?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the test type. Deactivating instead keeps past results readable.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(t)}>Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No tests match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{draft.id ? "Edit test" : "New test"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Test name</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Throat Swab Culture and Sensitivity" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={draft.category_id} onValueChange={(v) => setDraft({ ...draft, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Result entry type</Label>
                <Select value={draft.input_type} onValueChange={(v) => setDraft({ ...draft, input_type: v as LabInputType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INPUT_TYPES.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {draft.input_type === "number" && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Unit</Label>
                  <Input value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} placeholder="mmol/L" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Reference range</Label>
                  <Input value={draft.reference_range} onChange={(e) => setDraft({ ...draft, reference_range: e.target.value })} placeholder="3.5 – 5.5" />
                </div>
              </div>
            )}
            {draft.input_type === "select" && (
              <div className="space-y-1">
                <Label className="text-xs">Choices (comma separated)</Label>
                <Input value={draft.options} onChange={(e) => setDraft({ ...draft, options: e.target.value })} placeholder="Reactive, Non-Reactive" />
              </div>
            )}
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
              <Label className="text-xs">Active (available when entering results)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageTests;
