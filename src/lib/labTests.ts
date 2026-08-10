import { supabase } from "@/integrations/supabase/client";

export type LabInputType = "text" | "number" | "select" | "textarea";

export interface TestCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  active: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  category_id: string | null;
  code: string | null;
  input_type: LabInputType;
  unit: string | null;
  reference_range: string | null;
  description: string | null;
  options: string[];
  active: boolean;
  sort_order: number;
}

export async function fetchTestCategories(): Promise<TestCategory[]> {
  const { data, error } = await supabase
    .from("test_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as TestCategory[];
}

export async function fetchLabTests(): Promise<LabTest[]> {
  const { data, error } = await supabase
    .from("lab_tests")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as LabTest[];
}

export type LabTestInput = {
  name: string;
  category_id: string | null;
  input_type: LabInputType;
  unit?: string | null;
  reference_range?: string | null;
  options?: string[];
  active?: boolean;
  sort_order?: number;
};

export async function createLabTest(input: LabTestInput) {
  const { error } = await supabase.from("lab_tests").insert({
    name: input.name,
    category_id: input.category_id,
    input_type: input.input_type,
    unit: input.unit || null,
    reference_range: input.reference_range || null,
    options: input.options ?? [],
    active: input.active ?? true,
    sort_order: input.sort_order ?? 0,
  });
  if (error) throw error;
}

export async function updateLabTest(id: string, updates: Partial<LabTestInput>) {
  const { error } = await supabase.from("lab_tests").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteLabTest(id: string) {
  const { error } = await supabase.from("lab_tests").delete().eq("id", id);
  if (error) throw error;
}

export async function createTestCategory(name: string, sort_order = 0) {
  const { error } = await supabase.from("test_categories").insert({ name, sort_order });
  if (error) throw error;
}

export async function updateTestCategory(id: string, updates: { name?: string; active?: boolean; sort_order?: number }) {
  const { error } = await supabase.from("test_categories").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteTestCategory(id: string) {
  const { error } = await supabase.from("test_categories").delete().eq("id", id);
  if (error) throw error;
}

/** Key used to store a dynamic lab test result inside test_forms.results */
export const testValueKey = (test: LabTest) => `lt:${test.id}`;
