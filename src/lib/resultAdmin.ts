import { supabase } from "@/integrations/supabase/client";

async function logAudit(entry: {
  form_id?: string | null;
  serial: string;
  action: string;
  reason?: string;
  changed_by?: string | null;
  changed_by_name?: string | null;
}) {
  if (!entry.changed_by) return;
  await supabase.from("result_audit_log").insert({
    form_id: entry.form_id ?? null,
    serial: entry.serial,
    action: entry.action,
    reason: entry.reason ?? null,
    changed_by: entry.changed_by,
    changed_by_name: entry.changed_by_name ?? null,
  });
}

export async function approveResult(form: { id: string; serial: string }, user: { id: string; name?: string | null }) {
  const { error } = await supabase
    .from("test_forms")
    .update({
      approval_status: "Approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      rejected_by: null,
      rejected_at: null,
      rejection_reason: null,
      status: "Completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", form.id);
  if (error) throw error;
  await logAudit({ ...form, action: "approved", changed_by: user.id, changed_by_name: user.name });
}

export async function reopenApprovedResult(
  form: { id: string; serial: string },
  user: { id: string; name?: string | null },
  reason: string
) {
  const { error } = await supabase
    .from("test_forms")
    .update({
      approval_status: "Pending Review",
      approved_by: null,
      approved_at: null,
      last_edited_by: user.id,
    })
    .eq("id", form.id);
  if (error) throw error;
  await logAudit({ ...form, action: "reopened_after_approval", reason, changed_by: user.id, changed_by_name: user.name });
}

export async function deleteTestForm(form: { id: string; serial: string }, user: { id: string; name?: string | null }, reason: string) {
  await logAudit({ serial: form.serial, action: "deleted", reason, changed_by: user.id, changed_by_name: user.name });
  const { error } = await supabase.from("test_forms").delete().eq("id", form.id);
  if (error) throw error;
}
