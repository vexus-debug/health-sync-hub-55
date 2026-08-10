import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/shop";

const fetchAll = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
};

interface FormState {
  id?: string;
  name: string;
  uses: string;
  category: string;
  active: boolean;
}

const empty: FormState = {
  name: "", uses: "", category: PRODUCT_CATEGORIES[0], active: true,
};

const ProductDialog = ({
  open, onOpenChange, initial, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: FormState;
  onSaved: () => void;
}) => {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.category) {
      toast({ title: "Name and category are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        uses: form.uses.trim() || null,
        category: form.category,
        active: form.active,
      };
      const { error } = form.id
        ? await supabase.from("products").update(payload).eq("id", form.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
      toast({ title: form.id ? "Product updated" : "Product added" });
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Uses / Description</Label>
            <Textarea
              rows={4}
              placeholder="Shown in the dropdown when a customer expands this item."
              value={form.uses}
              onChange={(e) => setForm({ ...form, uses: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <Label className="m-0">Visible in shop</Label>
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="hero" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : form.id ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ShopAdmin = () => {
  const { profile, loading } = useAuth();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FormState>(empty);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAll,
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Product deleted" });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["shop-products"] });
    },
    onError: (e: any) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  if (loading) return <DashboardLayout><div className="p-8">Loading…</div></DashboardLayout>;
  const isSenior = (profile?.role ?? "").toLowerCase().includes("senior");
  if (!isSenior) return <Navigate to="/dashboard" replace />;

  const openNew = () => { setEditing(empty); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditing({
      id: p.id,
      name: p.name,
      uses: p.uses ?? p.description ?? "",
      category: p.category,
      active: p.active,
    });
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shop Management</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or remove products in the public shop.</p>
        </div>
        <Button variant="hero" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Add product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No products yet. Click <strong>Add product</strong> to get started.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                  {!p.active && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                </div>
                <h3 className="font-semibold text-sm">{p.name}</h3>
                {(p.uses || p.description) && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.uses || p.description}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{p.name}" will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductDialog
        key={editing.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-products"] });
          qc.invalidateQueries({ queryKey: ["shop-products"] });
        }}
      />
    </DashboardLayout>
  );
};

export default ShopAdmin;
