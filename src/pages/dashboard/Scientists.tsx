import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, UserPlus, Loader2, Pencil, Trash2, Shield } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchScientists } from "@/lib/supabaseQueries";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Scientist = {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  active: boolean | null;
};

const callManage = async (payload: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke("manage-scientist", {
    body: payload,
  });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const response = error.context;
      const body = await response.json().catch(() => null);
      const message = body && typeof body === "object" && "error" in body
        ? String(body.error)
        : error.message;
      throw new Error(message);
    }
    throw new Error(error.message);
  }
  if ((data as any)?.error) throw new Error((data as any).error);
  return data;
};

const Scientists = () => {
  const { profile } = useAuth();
  const isSenior = (profile?.role ?? "").toLowerCase().includes("senior");

  const { data: scientists = [], isLoading } = useQuery({
    queryKey: ["scientists"],
    queryFn: fetchScientists,
  });
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Scientist | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "Lab Scientist",
    email: "",
    password: "",
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["scientists"] });

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      await callManage({ action: "create", ...form });
      toast.success("Scientist created");
      refresh();
      setCreateOpen(false);
      setForm({ name: "", role: "Lab Scientist", email: "", password: "" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await callManage({
        action: "update",
        id: editing.id,
        name: editing.name,
        email: editing.email,
        role: editing.role,
        active: editing.active,
        ...(form.password ? { password: form.password } : {}),
      });
      toast.success("Scientist updated");
      refresh();
      setEditing(null);
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await callManage({ action: "delete", id });
      toast.success("Scientist removed");
      refresh();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Scientists</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lab personnel with dashboard access
            {isSenior && (
              <span className="ml-2 inline-flex items-center gap-1 text-primary font-medium">
                <Shield className="h-3 w-3" /> Senior controls enabled
              </span>
            )}
          </p>
        </div>
        {isSenior && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <UserPlus className="h-4 w-4" /> Add Scientist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Scientist</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Sci. …"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  variant="hero"
                  className="w-full"
                  disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} Create Scientist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scientists.map((s: Scientist) => (
            <Card key={s.id} className="border-border/60 shadow-soft">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                      {s.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
                      <Mail className="h-3 w-3" /> {s.email}
                    </p>
                  </div>
                  <Badge variant={s.active ? "default" : "secondary"}>
                    {s.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {isSenior && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditing(s);
                        setForm((f) => ({ ...f, password: "" }));
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {s.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will deactivate the scientist and revoke their
                            login access. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(s.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {scientists.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              No scientists added yet.
            </p>
          )}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scientist</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={editing.role ?? ""}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editing.email ?? ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div>
                <Label>New Password (optional)</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Inactive users cannot sign in
                  </p>
                </div>
                <Button
                  type="button"
                  variant={editing.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditing({ ...editing, active: !editing.active })}
                >
                  {editing.active ? "Active" : "Inactive"}
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleUpdate} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Scientists;
