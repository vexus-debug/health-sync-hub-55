import { LAB_SECTIONS } from "@/lib/labCatalog";
import { sectionHasValues } from "@/lib/labValidation";
import { TestForm } from "@/lib/labCatalog";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/site";

export type DynamicRow = { key: string; label: string; unit?: string | null; range?: string | null };

export const ReportPreview = ({ form, values, scientistName, dynamicRows = [] }: { form: TestForm; values: Record<string, string>; scientistName?: string; dynamicRows?: DynamicRow[] }) => {
  const populated = LAB_SECTIONS.filter((s) => sectionHasValues(s, values));
  const filledDynamic = dynamicRows.filter((r) => (values[r.key] ?? "").trim() !== "");

  return (
    <div className="bg-white text-slate-900 rounded-xl border border-border shadow-soft overflow-hidden text-[13px] print-report">
      <div className="px-6 py-4 border-b-4 border-primary bg-white" data-pdf-section="header">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Medvic Goodhealth" className="h-16 w-auto" crossOrigin="anonymous" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{SITE.fullName}</p>
              <h2 className="text-base font-bold leading-tight text-slate-900">Medical Laboratory Report</h2>
              <p className="text-[10px] italic text-slate-500">{SITE.tagline}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">RC {SITE.rcNumber} • TIN {SITE.tin}</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-600 leading-snug max-w-[40%]">
            <p>Plot 1, Road 4, Udo Layout</p>
            <p>Rumuokwachi, Port Harcourt</p>
            <p className="font-medium text-slate-800">{SITE.phones[0]}</p>
            <p>{SITE.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs" data-pdf-section="patient-info">
        <Field label="Surname" value={form.patientName.split(" ").slice(-1)[0]} />
        <Field label="Other Names" value={form.patientName.split(" ").slice(0, -1).join(" ")} />
        <Field label="Age" value={`${form.age}`} />
        <Field label="Sex" value={form.gender} />
        <Field label="Date" value={new Date(form.dateCollected).toLocaleDateString()} />
        <Field label="Lab No." value={form.serial} />
        <Field label="Referred By" value={form.referredBy} />
        <Field label="Specimen" value={form.natureOfSpecimen} wide />
        <Field label="Examination" value={form.examinationRequired} wide />
      </div>

      <div className="px-6 py-4 space-y-5">
        {populated.length === 0 && filledDynamic.length === 0 && (
          <p className="text-center py-8 text-muted-foreground italic text-sm">
            Enter values on the left to see the live report preview.
          </p>
        )}
        {filledDynamic.length > 0 && (
          <section data-pdf-section="requested-tests">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary border-b-2 border-primary/30 pb-1 mb-2">
              Requested Tests
            </h3>
            <table className="w-full text-xs">
              <tbody>
                {filledDynamic.map((r) => (
                  <tr key={r.key}>
                    <td className="py-1 pr-3 text-slate-700">{r.label}</td>
                    <td className="py-1 pr-3 font-semibold text-slate-900">
                      {values[r.key]} {r.unit && <span className="text-[11px] text-slate-500 font-normal">{r.unit}</span>}
                    </td>
                    <td className="py-1 text-[11px] text-slate-500">{r.range ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {populated.map((section) => (
          <section key={section.id} data-pdf-section={section.id}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary border-b-2 border-primary/30 pb-1 mb-2">
              {section.title}
            </h3>
            {section.layout === "antigen-table" && section.antigenRows ? (
              <>
                <table className="w-full border border-slate-300">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-700">
                      <th className="text-left font-semibold py-1.5 px-2 border-b border-slate-300">Antigen</th>
                      <th className="text-left font-semibold py-1.5 px-2 border-b border-l border-slate-300 w-[22%]">'O'</th>
                      <th className="text-left font-semibold py-1.5 px-2 border-b border-l border-slate-300 w-[22%]">'H'</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.antigenRows.map((row) => (
                      <tr key={row.label} className="text-[12px]">
                        <td className="py-1.5 px-2 border-t border-slate-200 text-slate-800">{row.label}</td>
                        <td className="py-1.5 px-2 border-t border-l border-slate-200 font-semibold text-slate-900">{values[row.oKey] || "—"}</td>
                        <td className="py-1.5 px-2 border-t border-l border-slate-200 font-semibold text-slate-900">{values[row.hKey] || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.footnote && (
                  <p className="text-[10px] italic text-slate-600 mt-1 text-center">{section.footnote}</p>
                )}
              </>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="text-left font-medium py-1 w-1/2">Test</th>
                    <th className="text-left font-medium py-1">Result</th>
                    <th className="text-left font-medium py-1">Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {section.fields
                    .filter((f) => values[f.key] && values[f.key].trim() !== "")
                    .map((f) => (
                      <tr key={f.key} className="border-t border-slate-100">
                        <td className="py-1.5 text-slate-700">{f.label}</td>
                        <td className="py-1.5 font-semibold text-slate-900">
                          {values[f.key]} {f.unit && <span className="text-[11px] text-slate-500 font-normal">{f.unit}</span>}
                        </td>
                        <td className="py-1.5 text-slate-500 text-[11px]">{f.range ?? "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </div>

      <div className="px-6 py-3 border-t-2 border-primary/40 bg-slate-50 text-[10px] text-slate-600" data-pdf-section="footer">
        <div className="flex justify-between items-start gap-4 mb-2">
          <span>Medical Laboratory Scientist: <span className="font-medium text-slate-900">{formatScientistName(scientistName)}</span></span>
          <span>Generated: {new Date().toLocaleString()}</span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[9px] text-slate-500">
          <span>{SITE.address}</span>
          <span>{SITE.phones.join(" • ")} • {SITE.email}</span>
        </div>
        <p className="text-center text-[9px] text-slate-400 mt-1 italic">Confidential medical document — © {new Date().getFullYear()} {SITE.fullName}</p>
      </div>
    </div>
  );
};

const formatScientistName = (name?: string | null) => {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "—";
  if (/^sci[.:]?\s/i.test(trimmed)) return trimmed;
  return `Sci: ${trimmed}`;
};

const Field = ({ label, value, wide }: { label: string; value: string; wide?: boolean }) => (
  <div className={wide ? "col-span-2 md:col-span-3" : ""}>
    <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
    <p className="font-medium text-slate-800 break-words whitespace-normal">{value || "—"}</p>
  </div>
);
