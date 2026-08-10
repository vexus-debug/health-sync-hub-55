import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = (value: unknown) => normalizeText(value).toLowerCase();

const findAuthUserByEmail = async (admin: any, email: string) => {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.find((user: { email?: string | null }) => user.email?.toLowerCase() === email) ?? null;
};

const syncProfile = async (admin: any, userId: string, name: string, role: string, active = true) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { error } = await admin.from("profiles").upsert(
      {
        user_id: userId,
        display_name: name,
        role,
        active,
      },
      { onConflict: "user_id" },
    );

    if (!error) return;
    if (attempt === 2) throw error;
    await sleep(150);
  }
};

const syncScientistDirectory = async (
  admin: any,
  scientist: { id?: string; name: string; email: string; role: string; active: boolean },
) => {
  if (scientist.id) {
    const { data, error } = await admin
      .from("scientists")
      .update({
        name: scientist.name,
        email: scientist.email,
        role: scientist.role,
        active: scientist.active,
      })
      .eq("id", scientist.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data: existing, error: existingErr } = await admin
    .from("scientists")
    .select("id")
    .ilike("email", scientist.email)
    .limit(1)
    .maybeSingle();
  if (existingErr) throw existingErr;

  if (existing?.id) {
    const { data, error } = await admin
      .from("scientists")
      .update({
        name: scientist.name,
        email: scientist.email,
        role: scientist.role,
        active: scientist.active,
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await admin
    .from("scientists")
    .insert({
      name: scientist.name,
      email: scientist.email,
      role: scientist.role,
      active: scientist.active,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate caller
    const authHeader = req.headers.get("Authorization") ?? "";
    console.log("manage-scientist invoked, hasAuth:", !!authHeader);
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) {
      console.log("Auth failed:", userErr?.message);
      return json({ error: "Unauthorized: " + (userErr?.message ?? "no user") }, 401);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check role on profiles
    const { data: profile, error: profErr } = await admin
      .from("profiles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .maybeSingle();
    console.log("Caller role:", profile?.role, "err:", profErr?.message);

    if (!profile || !(profile.role ?? "").toLowerCase().includes("senior")) {
      return json({ error: "Forbidden — Senior Scientist only" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as "create" | "update" | "delete";
    console.log("action:", action);

    if (action === "create") {
      const name = normalizeText(body.name);
      const email = normalizeEmail(body.email);
      const password = normalizeText(body.password);
      const role = normalizeText(body.role) || "Lab Scientist";
      if (!name || !email || !password) {
        return json({ error: "name, email, password required" }, 400);
      }
      try {
        let authUser = await findAuthUserByEmail(admin, email);

        if (authUser) {
          const { data: updatedUser, error: updateUserErr } = await admin.auth.admin.updateUserById(
            authUser.id,
            {
              email,
              password,
              email_confirm: true,
              user_metadata: {
                ...(authUser.user_metadata ?? {}),
                full_name: name,
              },
            },
          );
          if (updateUserErr) throw updateUserErr;
          authUser = updatedUser.user;
        } else {
          const { data: created, error: createErr } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name },
          });
          if (createErr) throw createErr;
          authUser = created.user;
        }

        if (!authUser) {
          return json({ error: "Unable to create or reuse scientist login" }, 400);
        }

        await syncProfile(admin, authUser.id, name, role, true);
        const sci = await syncScientistDirectory(admin, { name, email, role, active: true });

        return json({ scientist: sci, user_id: authUser.id });
      } catch (createError) {
        console.log("create scientist error:", (createError as Error).message);
        return json({ error: (createError as Error).message }, 400);
      }
    }

    if (action === "update") {
      const id = normalizeText(body.id);
      const name = normalizeText(body.name);
      const email = normalizeEmail(body.email);
      const role = normalizeText(body.role) || "Lab Scientist";
      const password = normalizeText(body.password);
      const active = body.active !== false;
      if (!id) return json({ error: "id required" }, 400);

      try {
        const { data: currentScientist, error: currentErr } = await admin
          .from("scientists")
          .select("id, email")
          .eq("id", id)
          .maybeSingle();
        if (currentErr) throw currentErr;

        const sci = await syncScientistDirectory(admin, { id, name, email, role, active });
        const target = (currentScientist?.email && await findAuthUserByEmail(admin, currentScientist.email.toLowerCase()))
          ?? (email ? await findAuthUserByEmail(admin, email) : null);

        if (target) {
          const { error: authUpdateErr } = await admin.auth.admin.updateUserById(target.id, {
            ...(email ? { email } : {}),
            ...(password ? { password } : {}),
            ...(name
              ? {
                user_metadata: {
                  ...(target.user_metadata ?? {}),
                  full_name: name,
                },
              }
              : {}),
          });
          if (authUpdateErr) throw authUpdateErr;

          await syncProfile(admin, target.id, name, role, active);
        }

        return json({ scientist: sci });
      } catch (updateError) {
        return json({ error: (updateError as Error).message }, 400);
      }
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return json({ error: "id required" }, 400);

      const { data: sci } = await admin
        .from("scientists")
        .select("email")
        .eq("id", id)
        .maybeSingle();

      // Soft-delete in scientists (no delete RLS) by deactivating
      await admin.from("scientists").update({ active: false }).eq("id", id);

      // Remove auth user if found
      if (sci?.email) {
        const { data: list } = await admin.auth.admin.listUsers();
        const target = list.users.find((u) => u.email === sci.email);
        if (target) await admin.auth.admin.deleteUser(target.id);
      }

      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
