import { DbTestForm } from "./supabaseQueries";
import { SITE } from "./site";
import { LAB_SECTIONS } from "./labCatalog";
import logo from "@/assets/logo.png";

export function printTestForm(form: DbTestForm) {
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) return;
  const dateStr = new Date(form.date_collected).toLocaleString();
  const tests = form.tests_requested.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const results = (form.results ?? {}) as Record<string, string>;
  const resultsHtml = LAB_SECTIONS.map((section) => {
    if (section.layout === "antigen-table" && section.antigenRows) {
      const hasAny = section.antigenRows.some(
        (r) => (results[r.oKey] && String(results[r.oKey]).trim() !== "") ||
               (results[r.hKey] && String(results[r.hKey]).trim() !== "")
      );
      if (!hasAny) return "";
      const rows = section.antigenRows.map((r) => `<tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;color:#0f172a;">${escapeHtml(r.label)}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;font-weight:600;color:#0f172a;">${escapeHtml(String(results[r.oKey] ?? "—"))}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;font-weight:600;color:#0f172a;">${escapeHtml(String(results[r.hKey] ?? "—"))}</td>
      </tr>`).join("");
      return `<div class="section"><h3>${escapeHtml(section.title)}</h3>
        <table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #cbd5e1;">
          <thead><tr style="background:#f1f5f9;color:#334155;font-size:11px;">
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:left;">Antigen</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:left;width:22%;">'O'</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:left;width:22%;">'H'</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${section.footnote ? `<p style="margin:6px 0 0;text-align:center;font-size:11px;font-style:italic;color:#475569;">${escapeHtml(section.footnote)}</p>` : ""}
      </div>`;
    }
    const rows = section.fields
      .filter((f) => results[f.key] && String(results[f.key]).trim() !== "")
      .map(
        (f) => `<tr>
          <td style="padding:4px 8px;border-top:1px solid #f1f5f9;color:#334155;">${escapeHtml(f.label)}</td>
          <td style="padding:4px 8px;border-top:1px solid #f1f5f9;font-weight:600;color:#0f172a;">${escapeHtml(String(results[f.key]))}${f.unit ? ` <span style=\"font-weight:400;color:#64748b;font-size:10px;\">${escapeHtml(f.unit)}</span>` : ""}</td>
          <td style="padding:4px 8px;border-top:1px solid #f1f5f9;color:#64748b;font-size:11px;">${escapeHtml(f.range ?? "—")}</td>
        </tr>`
      )
      .join("");
    if (!rows) return "";
    return `<div class="section"><h3>${escapeHtml(section.title)}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="text-align:left;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">
          <th style="padding:4px 8px;width:50%;">Test</th><th style="padding:4px 8px;">Result</th><th style="padding:4px 8px;">Reference</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }).join("");
  const html = `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>Test Form ${escapeHtml(form.serial)} — ${escapeHtml(form.patient_name)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #1e293b; margin: 0; padding: 24px; font-size: 13px; }
  .wrap { max-width: 800px; margin: 0 auto; border: 1px solid #e5e0ec; border-radius: 12px; overflow: hidden; }
  .head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 4px solid #6b21a8; gap: 16px; }
  .head img { height: 64px; width: auto; }
  .brand .name { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: #6b21a8; font-weight: 700; }
  .brand h1 { margin: 2px 0 0; font-size: 18px; color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif; }
  .brand .tag { font-style: italic; font-size: 10px; color: #64748b; margin-top: 2px; }
  .contact { text-align: right; font-size: 10px; color: #475569; line-height: 1.5; }
  .contact .phone { color: #0f172a; font-weight: 500; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 16px; padding: 16px 20px; border-bottom: 1px solid #ece6f3; }
  .grid .full { grid-column: 1 / -1; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; }
  .val { font-weight: 500; color: #0f172a; margin-top: 2px; }
  .section { padding: 14px 20px; border-bottom: 1px solid #ece6f3; }
  .section h3 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #6b21a8; border-bottom: 2px solid #d8b4fe; padding-bottom: 4px; }
  ul { margin: 0; padding-left: 20px; }
  ul li { padding: 2px 0; }
  .notes { white-space: pre-wrap; color: #334155; }
  .signs { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 30px 20px 20px; }
  .sign { border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 11px; color: #475569; }
  .foot { background: #f8fafc; padding: 10px 20px; font-size: 9px; color: #64748b; border-top: 2px solid #d8b4fe; text-align: center; }
  .foot .row { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; }
  .foot .conf { font-style: italic; color: #94a3b8; }
  @media print { body { padding: 0; } .wrap { border: none; border-radius: 0; } .no-print { display: none; } }
  .toolbar { max-width: 800px; margin: 0 auto 12px; display: flex; justify-content: flex-end; gap: 8px; }
  .btn { background: #6b21a8; color: white; border: 0; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: inherit; }
  .btn.secondary { background: #e5e7eb; color: #1e293b; }
</style>
</head><body>
<div class="toolbar no-print">
  <button class="btn secondary" onclick="window.close()">Close</button>
  <button class="btn" onclick="window.print()">Print</button>
</div>
<div class="wrap">
  <div class="head">
    <div style="display:flex; align-items:center; gap:12px;">
      <img src="${logo}" alt="${escapeHtml(SITE.fullName)}" />
      <div class="brand">
        <div class="name">${escapeHtml(SITE.fullName)}</div>
        <h1>Laboratory Test Request Form</h1>
        <div class="tag">${escapeHtml(SITE.tagline)}</div>
        <div class="tag" style="font-style:normal; color:#475569;">RC ${escapeHtml(SITE.rcNumber)} • TIN ${escapeHtml(SITE.tin)}</div>
      </div>
    </div>
    <div class="contact">
      <div>Plot 1, Road 4, Udo Layout</div>
      <div>Rumuokwachi, Port Harcourt</div>
      <div class="phone">${escapeHtml(SITE.phones[0])}</div>
      <div>${escapeHtml(SITE.email)}</div>
    </div>
  </div>
  <div class="grid">
    <div><div class="label">Lab No.</div><div class="val">${escapeHtml(form.serial)}</div></div>
    <div><div class="label">Date Collected</div><div class="val">${escapeHtml(dateStr)}</div></div>
    <div><div class="label">Status</div><div class="val">${escapeHtml(form.status)}</div></div>
    <div><div class="label">Patient Name</div><div class="val">${escapeHtml(form.patient_name)}</div></div>
    <div><div class="label">Age</div><div class="val">${form.age} yrs</div></div>
    <div><div class="label">Sex</div><div class="val">${escapeHtml(form.gender)}</div></div>
    <div><div class="label">Phone</div><div class="val">${escapeHtml(form.phone ?? "—")}</div></div>
    <div><div class="label">Email</div><div class="val">${escapeHtml(form.email ?? "—")}</div></div>
    <div><div class="label">Bill To</div><div class="val">${escapeHtml(form.bill)}</div></div>
    <div><div class="label">Referred By</div><div class="val">${escapeHtml(form.referred_by ?? "—")}</div></div>
    <div><div class="label">Doctor Phone</div><div class="val">${escapeHtml(form.doctor_phone ?? "—")}</div></div>
    <div><div class="label">Institution</div><div class="val">${escapeHtml(form.institution ?? "—")}</div></div>
    <div class="full"><div class="label">Specimen</div><div class="val">${escapeHtml(form.nature_of_specimen ?? "—")}</div></div>
    <div class="full"><div class="label">Examination Required</div><div class="val">${escapeHtml(form.examination_required ?? "—")}</div></div>
  </div>
  ${resultsHtml}
  ${form.clinical_notes ? `<div class="section"><h3>Clinical Notes</h3><div class="notes">${escapeHtml(form.clinical_notes)}</div></div>` : ""}
  <div class="signs">
    <div class="sign">Patient / Guardian Signature</div>
    <div class="sign">Received By (Lab Officer)</div>
  </div>
  <div class="foot">
    <div class="row"><span>${escapeHtml(SITE.address)}</span><span>${escapeHtml(SITE.phones.join(" • "))} • ${escapeHtml(SITE.email)}</span></div>
    <div class="conf">Confidential medical document — © ${new Date().getFullYear()} ${escapeHtml(SITE.fullName)}</div>
  </div>
</div>
<script>window.addEventListener('load', () => setTimeout(() => window.print(), 400));</script>
</body></html>`;
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}