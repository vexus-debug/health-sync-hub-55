import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_FORMS, TestForm, TestStatus } from "./labCatalog";

interface LabState {
  forms: TestForm[];
  drafts: Record<string, Record<string, string>>;
  updateDraft: (serial: string, values: Record<string, string>) => void;
  saveResults: (serial: string, values: Record<string, string>, status?: TestStatus) => void;
  getForm: (serial: string) => TestForm | undefined;
  createForm: (data: Omit<TestForm, "status"> & { serial?: string }) => TestForm;
  nextSerial: () => string;
}

const pad = (n: number, w = 5) => String(n).padStart(w, "0");

export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      forms: MOCK_FORMS,
      drafts: {},
      updateDraft: (serial, values) =>
        set((s) => ({ drafts: { ...s.drafts, [serial]: { ...(s.drafts[serial] ?? {}), ...values } } })),
      saveResults: (serial, values, status) =>
        set((s) => ({
          forms: s.forms.map((f) =>
            f.serial === serial
              ? {
                  ...f,
                  results: { ...(f.results ?? {}), ...values },
                  status: status ?? (f.status === "Pending" ? "Processing" : f.status),
                  completedAt: status === "Completed" ? new Date().toISOString() : f.completedAt,
                }
              : f,
          ),
        })),
      getForm: (serial) => get().forms.find((f) => f.serial === serial),
      nextSerial: () => {
        const year = new Date().getFullYear();
        const nums = get().forms
          .map((f) => f.serial.match(/MV-\d{4}-(\d+)/))
          .filter(Boolean)
          .map((m) => parseInt(m![1], 10));
        const next = (nums.length ? Math.max(...nums) : 0) + 1;
        return `MV-${year}-${pad(next)}`;
      },
      createForm: (data) => {
        const serial = (data.serial && data.serial.trim()) || get().nextSerial();
        const newForm: TestForm = { ...data, serial, status: "Pending" };
        set((s) => ({ forms: [newForm, ...s.forms] }));
        return newForm;
      },
    }),
    { name: "medvic-lab-store" },
  ),
);
