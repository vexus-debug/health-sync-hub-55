// Single source of truth for all lab tests, transcribed meticulously from
// MEDVIC_GOODHEALTH_MEDICAL_LABORATORY_LAB_REPORT_2.pdf and MEDVIC_LAB_TEST_FORM.pdf.
// Do not remove fields — every entry maps to a row on the printed report.

export type FieldType = "number" | "text" | "select" | "textarea";

export interface LabField {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  range?: string;
  options?: string[];
  placeholder?: string;
}

export interface AntigenRow {
  label: string;
  oKey: string;
  hKey: string;
}

export interface LabSection {
  id: string;
  title: string;
  category: "Hematology" | "Chemical Pathology" | "Microbiology" | "Urinalysis" | "Sensitivity" | "Microscopy" | "Semen" | "Other";
  fields: LabField[];
  layout?: "default" | "antigen-table";
  antigenRows?: AntigenRow[];
  footnote?: string;
}

export const LAB_SECTIONS: LabSection[] = [
  {
    id: "haematology",
    title: "Haematology",
    category: "Hematology",
    fields: [
      { key: "hb", label: "Hb", type: "number", unit: "g/dl", range: "12.5 – 16" },
      { key: "pcv", label: "PCV", type: "number", unit: "%", range: "37 – 48" },
      { key: "wbc", label: "WBC", type: "number", unit: "x10⁹/L", range: "4.0 – 11.0" },
      { key: "neutrophils", label: "Diff: Neutrophils", type: "number", unit: "%", range: "49 – 75" },
      { key: "lymphocyte", label: "Lymphocyte", type: "number", unit: "%", range: "20 – 40" },
      { key: "monocyte", label: "Monocyte", type: "number", unit: "%", range: "2 – 10" },
      { key: "eosinophil", label: "Eosinophil", type: "number", unit: "%", range: "1 – 8" },
      { key: "basophil", label: "Basophil", type: "number", unit: "%", range: "0 – 1" },
      { key: "filmReport", label: "Film Report", type: "textarea" },
      { key: "malariaParasite", label: "Malaria Parasite", type: "select", options: ["Not Seen", "Seen (+)", "Seen (++)", "Seen (+++)"] },
      { key: "platelets", label: "Platelets", type: "number", unit: "x10⁹/L", range: "150 – 400" },
      { key: "esr", label: "ESR", type: "number", unit: "mm/Hr", range: "0 – 9 (W)" },
      { key: "prothrombinTime", label: "Prothrombin Time", type: "number", unit: "mins", range: "11 – 15" },
      { key: "directCombs", label: "Direct Combs", type: "select", options: ["Positive", "Negative"] },
      { key: "indirectCombs", label: "Indirect Combs", type: "select", options: ["Positive", "Negative"] },
      { key: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      { key: "genotype", label: "Genotype", type: "select", options: ["AA", "AS", "AC", "SS", "SC", "CC"] },
      { key: "hepatitisA", label: "Hepatitis A", type: "select", options: ["Reactive", "Non-Reactive"] },
      { key: "hepatitisB", label: "Hepatitis B", type: "select", options: ["Reactive", "Non-Reactive"] },
      { key: "hepatitisC", label: "Hepatitis C", type: "select", options: ["Reactive", "Non-Reactive"] },
      { key: "retroviralScreening", label: "Retroviral Screening (HIV 1 & 2)", type: "select", options: ["Reactive", "Non-Reactive"] },
      { key: "vdrl", label: "VDRL (Syphilis)", type: "select", options: ["Reactive", "Non-Reactive"] },
      { key: "pregnancy", label: "Pregnancy", type: "select", options: ["Positive", "Negative"] },
      { key: "haemOthers", label: "Others", type: "textarea" },
    ],
  },
  {
    id: "chemPath",
    title: "Chemical Pathology",
    category: "Chemical Pathology",
    fields: [
      { key: "fbs", label: "Fasting Blood Sugar", type: "number", unit: "mmol/L", range: "3.3 – 6" },
      { key: "rbs", label: "Random Blood Sugar", type: "number", unit: "mmol/L", range: "3.3 – 7.4" },
      { key: "tBilirubin", label: "LFT — T. Bilirubin", type: "number", unit: "µmol/L", range: "0 – 17.3" },
      { key: "cBilirubin", label: "C.B. Bilirubin", type: "number", unit: "µmol/L", range: "0 – 4.3" },
      { key: "alkPhos", label: "Alk Phos", type: "number", unit: "iu/L", range: "42 – 14" },
      { key: "ast", label: "SGOT (AST)", type: "number", unit: "U/L", range: "0 – 37" },
      { key: "alt", label: "SGPT (ALT)", type: "number", unit: "U/L", range: "0 – 41" },
      { key: "totalProtein", label: "Total Protein", type: "number", unit: "g/L", range: "58 – 80" },
      { key: "albumin", label: "Albumin", type: "number", unit: "g/L", range: "25 – 50" },
      { key: "sodium", label: "Sodium", type: "number", unit: "mmol/L", range: "128 – 150" },
      { key: "potassium", label: "Potassium", type: "number", unit: "mmol/L", range: "3.0 – 5.5" },
      { key: "chloride", label: "Chloride", type: "number", unit: "mmol/L", range: "98 – 110" },
      { key: "bicarbonate", label: "Bicarbonate", type: "number", unit: "mmol/L", range: "23 – 31" },
      { key: "calcium", label: "Calcium", type: "number", unit: "mmol/L", range: "2.1 – 2.6" },
      { key: "urea", label: "Urea", type: "number", unit: "mmol/L", range: "2.0 – 8.0" },
      { key: "creatinine", label: "Creatinine", type: "number", unit: "µmol/L", range: "60 – 120" },
      { key: "uricAcid", label: "Uric Acid", type: "number", unit: "µmol/L", range: "120 – 420" },
      { key: "cholesterol", label: "Cholesterol", type: "number", unit: "mmol/L", range: "< 5.17" },
      { key: "triglyceride", label: "Triglyceride", type: "number", unit: "mmol/L", range: "0.4 – 1.82" },
      { key: "hdl", label: "HDL", type: "number", unit: "mmol/L", range: "0.9 – 1.42" },
      { key: "ldl", label: "LDL", type: "number", unit: "mmol/L", range: "< 3.36" },
      { key: "hba1c", label: "Glycated Haemoglobin (HbA1c)", type: "number", unit: "%", range: "4.0 – 5.6" },
      { key: "hba1cEAG", label: "HbA1c — Estimated Avg Glucose", type: "number", unit: "mmol/L", placeholder: "Optional" },
      { key: "hba1cInterpretation", label: "HbA1c Interpretation", type: "select", options: ["Normal", "Prediabetes", "Diabetes", "Good Control", "Fair Control", "Poor Control"] },
    ],
  },
  {
    id: "widal",
    title: "Widal Test",
    category: "Microbiology",
    layout: "antigen-table",
    footnote: "Significant Titre 1/80",
    antigenRows: [
      { label: "Salmonella Typhi", oKey: "salTyphiO", hKey: "salTyphiH" },
      { label: "Sal. Paratyphi A", oKey: "salParaAO", hKey: "salParaAH" },
      { label: "Sal. Paratyphi B", oKey: "salParaBO", hKey: "salParaBH" },
      { label: "Sal. Paratyphi C", oKey: "salParaCO", hKey: "salParaCH" },
    ],
    fields: [
      { key: "salTyphiO", label: "Salmonella Typhi — O", type: "text", placeholder: "e.g. 1/80" },
      { key: "salTyphiH", label: "Salmonella Typhi — H", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaAO", label: "Sal. Paratyphi A — O", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaAH", label: "Sal. Paratyphi A — H", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaBO", label: "Sal. Paratyphi B — O", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaBH", label: "Sal. Paratyphi B — H", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaCO", label: "Sal. Paratyphi C — O", type: "text", placeholder: "e.g. 1/80" },
      { key: "salParaCH", label: "Sal. Paratyphi C — H", type: "text", placeholder: "e.g. 1/80" },
    ],
  },
  {
    id: "fertility",
    title: "Fertility Profile",
    category: "Chemical Pathology",
    fields: [
      { key: "lh", label: "Luteinizing Hormone (LH)", type: "number", unit: "mIU/ml", range: "M: 1.7–8.6 / F: 0–20" },
      { key: "fsh", label: "Follicle Stimulating Hormone (FSH)", type: "number", unit: "mIU/ml", range: "M: 1.5–12 / F: 0–20" },
      { key: "prolactin", label: "Prolactin", type: "number", unit: "ng/ml", range: "M: <10.7 / F: 2–20" },
      { key: "progesterone", label: "Progesterone", type: "number", unit: "ng/ml", range: "F: 2–25" },
      { key: "estradiol", label: "Estradiol (E2)", type: "number", unit: "pg/ml", range: "F: 9–196" },
      { key: "testosterone", label: "Testosterone", type: "number", unit: "ng/ml", range: "M: <3.10" },
    ],
  },
  {
    id: "thyroid",
    title: "Thyroid Function & Hormones",
    category: "Chemical Pathology",
    fields: [
      { key: "t4", label: "T4", type: "number", unit: "µg/dl", range: "4.5 – 12.5" },
      { key: "t3", label: "T3", type: "number", unit: "ng/ml", range: "0.6 – 2.0" },
      { key: "tsh", label: "TSH", type: "number", unit: "mIU/ml", range: "0.4 – 4.0" },
      { key: "psa", label: "Prostate (PSA)", type: "number", unit: "ng/ml", range: "0 – 4" },
      { key: "cortisol", label: "Cortisol", type: "number", unit: "µg/dl", range: "" },
    ],
  },
  {
    id: "urinalysis",
    title: "Urinalysis",
    category: "Urinalysis",
    fields: [
      { key: "appearance", label: "Appearance", type: "text" },
      { key: "ph", label: "pH", type: "number" },
      { key: "specificGravity", label: "Specific Gravity", type: "number" },
      { key: "uProtein", label: "Protein", type: "select", options: ["Negative", "Trace", "+", "++", "+++"] },
      { key: "nitrite", label: "Nitrite", type: "select", options: ["Negative", "Positive"] },
      { key: "uGlucose", label: "Glucose", type: "select", options: ["Negative", "Trace", "+", "++", "+++"] },
      { key: "ketones", label: "Ketones", type: "select", options: ["Negative", "Trace", "+", "++", "+++"] },
      { key: "urobilinogen", label: "Urobilinogen", type: "text" },
      { key: "uBilirubin", label: "Bilirubin", type: "select", options: ["Negative", "Positive"] },
      { key: "ascorbicAcid", label: "Ascorbic Acid", type: "text" },
      { key: "leukocytes", label: "Leukocytes", type: "select", options: ["Negative", "Trace", "+", "++", "+++"] },
    ],
  },
  {
    id: "microscopy",
    title: "Microscopy",
    category: "Microscopy",
    fields: [
      { key: "epithelialCells", label: "Epithelial Cells", type: "text" },
      { key: "mWbc", label: "WBC", type: "text" },
      { key: "mRbc", label: "RBC", type: "text" },
      { key: "yeastCells", label: "Yeast Cells", type: "text" },
      { key: "cast", label: "Cast", type: "text" },
      { key: "crystal", label: "Crystal", type: "text" },
      { key: "bacteriaCells", label: "Bacteria Cells", type: "text" },
      { key: "microscopyRemarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "urineMicroscopy",
    title: "Urine Microscopy / Culture",
    category: "Microscopy",
    fields: [
      { key: "uMicEpithelialCells", label: "Epithelial Cells", type: "text" },
      { key: "uMicWbc", label: "WBC (Pus Cells)", type: "text" },
      { key: "uMicRbc", label: "RBC", type: "text" },
      { key: "uMicYeastCells", label: "Yeast Cells", type: "text" },
      { key: "uMicCast", label: "Cast", type: "text" },
      { key: "uMicCrystal", label: "Crystal", type: "text" },
      { key: "uMicBacteria", label: "Bacteria Cells", type: "text" },
      { key: "uCultureIsolates", label: "Urine Culture — Isolates", type: "textarea" },
      { key: "uCultureColonyCount", label: "Colony Count", type: "text" },
      { key: "uMicRemarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "hvsMicroscopy",
    title: "High Vaginal Swab (HVS) Microscopy / Culture",
    category: "Microscopy",
    fields: [
      { key: "hvsEpithelialCells", label: "Epithelial Cells", type: "text" },
      { key: "hvsWbc", label: "WBC (Pus Cells)", type: "text" },
      { key: "hvsRbc", label: "RBC", type: "text" },
      { key: "hvsYeastCells", label: "Yeast Cells", type: "text" },
      { key: "hvsTrichomonas", label: "Trichomonas Vaginalis", type: "select", options: ["Seen", "Not Seen"] },
      { key: "hvsClueCells", label: "Clue Cells", type: "select", options: ["Seen", "Not Seen"] },
      { key: "hvsGramStain", label: "Gram Stain", type: "text" },
      { key: "hvsBacteria", label: "Bacteria Cells", type: "text" },
      { key: "hvsCultureIsolates", label: "HVS Culture — Isolates", type: "textarea" },
      { key: "hvsRemarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "urethraSwab",
    title: "Urethral Swab Microscopy / Culture",
    category: "Microscopy",
    fields: [
      { key: "ursEpithelialCells", label: "Epithelial Cells", type: "text" },
      { key: "ursWbc", label: "WBC (Pus Cells)", type: "text" },
      { key: "ursRbc", label: "RBC", type: "text" },
      { key: "ursYeastCells", label: "Yeast Cells", type: "text" },
      { key: "ursGramStain", label: "Gram Stain", type: "text" },
      { key: "ursGonococci", label: "Gonococci (GC)", type: "select", options: ["Seen", "Not Seen"] },
      { key: "ursBacteria", label: "Bacteria Cells", type: "text" },
      { key: "ursCultureIsolates", label: "Urethral Swab Culture — Isolates", type: "textarea" },
      { key: "ursRemarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "sensitivity",
    title: "Sensitivity (Antibiotics)",
    category: "Sensitivity",
    fields: [
      "Pefloxacin","Gentamycin","Ampiclox","Zinnacef","Amoxicillin","Rocephin",
      "Ciprofloxacin","Azithromycin","Levofloxacin","Erythromycin","Ofloxacin",
      "Augmentin","Paflacine","Ceftazidine","Cefalexin","Ceftriaxone","Streptomycin",
    ].map((name) => ({
      key: `abx_${name.toLowerCase()}`,
      label: name,
      type: "select" as FieldType,
      options: ["—", "S (Sensitive)", "R (Resistant)", "I (Intermediate)"],
    })),
  },
  {
    id: "semen",
    title: "Semen Analysis",
    category: "Semen",
    fields: [
      { key: "timeProduced", label: "Time Produced", type: "text" },
      { key: "timeSubmitted", label: "Time Submitted", type: "text" },
      { key: "timeExamined", label: "Time Examined", type: "text" },
      { key: "volume", label: "Volume", type: "text", unit: "ml" },
      { key: "colour", label: "Colour", type: "text" },
      { key: "consistency", label: "Consistency", type: "text" },
      { key: "count", label: "Count", type: "text", unit: "x10⁶/ml" },
      { key: "activeMotile", label: "Active Motile", type: "number", unit: "%" },
      { key: "sluggish", label: "Sluggish", type: "number", unit: "%" },
      { key: "nonMotile", label: "Non-Motile", type: "number", unit: "%" },
      { key: "semenOthers", label: "Others", type: "textarea" },
      { key: "isolates", label: "Isolates", type: "textarea" },
    ],
  },
  {
    id: "earSwab",
    title: "Ear Swab Microscopy / Culture",
    category: "Microscopy",
    fields: [
      { key: "earEpithelialCells", label: "Epithelial Cells", type: "text" },
      { key: "earWbc", label: "WBC (Pus Cells)", type: "text" },
      { key: "earRbc", label: "RBC", type: "text" },
      { key: "earYeastCells", label: "Yeast Cells", type: "text" },
      { key: "earFungalElements", label: "Fungal Elements / Hyphae", type: "select", options: ["Seen", "Not Seen"] },
      { key: "earGramStain", label: "Gram Stain", type: "text" },
      { key: "earBacteria", label: "Bacteria Cells", type: "text" },
      { key: "earCultureIsolates", label: "Ear Swab Culture — Isolates", type: "textarea" },
      { key: "earCultureColonyCount", label: "Colony Count", type: "text" },
      { key: "earRemarks", label: "Remarks", type: "textarea" },
    ],
  },
  {
    id: "viralLoad",
    title: "Viral Load Results",
    category: "Chemical Pathology",
    fields: [
      { key: "hivViralLoad", label: "HIV-1 RNA Viral Load", type: "number", unit: "copies/mL", placeholder: "e.g. 1500" },
      { key: "hivViralLoadLog", label: "HIV Viral Load (Log₁₀)", type: "number", placeholder: "e.g. 3.18" },
      { key: "hivViralLoadStatus", label: "HIV Viral Load Status", type: "select", options: ["Target Not Detected", "Detected — Suppressed (<1000)", "Detected — Unsuppressed (≥1000)"] },
      { key: "hbvViralLoad", label: "HBV DNA Viral Load", type: "number", unit: "IU/mL", placeholder: "e.g. 2000" },
      { key: "hbvViralLoadStatus", label: "HBV Viral Load Status", type: "select", options: ["Not Detected", "Detected — Low", "Detected — High"] },
      { key: "hcvViralLoad", label: "HCV RNA Viral Load", type: "number", unit: "IU/mL", placeholder: "e.g. 800000" },
      { key: "hcvViralLoadStatus", label: "HCV Viral Load Status", type: "select", options: ["Not Detected", "Detected — Low", "Detected — High"] },
      { key: "viralLoadMethod", label: "Method / Platform", type: "text", placeholder: "e.g. RT-PCR (Abbott m2000)" },
      { key: "viralLoadRemarks", label: "Remarks / Interpretation", type: "textarea" },
    ],
  },
  {
    id: "other",
    title: "Other Investigations",
    category: "Other",
    fields: [
      { key: "bloodCultureIsolates", label: "Blood Culture — Isolates", type: "textarea" },
      { key: "hPylori", label: "H-Pylori", type: "select", options: ["Positive", "Negative"] },
      { key: "fob", label: "FOB (Faecal Occult Blood)", type: "select", options: ["Positive", "Negative"] },
      { key: "afb", label: "AFB", type: "select", options: ["Positive", "Negative"] },
      { key: "microfilaria", label: "Microfilaria", type: "select", options: ["Seen", "Not Seen"] },
      { key: "microfilariaSpecies", label: "Microfilaria — Species", type: "select", options: ["—", "Wuchereria bancrofti", "Loa loa", "Mansonella perstans", "Onchocerca volvulus", "Brugia malayi", "Other"] },
      { key: "microfilariaCount", label: "Microfilaria — Count (per µL)", type: "number", unit: "mf/µL", placeholder: "e.g. 120" },
      { key: "microfilariaRemarks", label: "Microfilaria — Remarks", type: "textarea" },
      { key: "mantoux", label: "Mantoux Test", type: "text" },
      { key: "chlamydia", label: "Chlamydia", type: "select", options: ["Positive", "Negative"] },
    ],
  },
];

// ----- Test Forms (mock data) -----
export type TestStatus = "Pending" | "Processing" | "Completed";

export interface TestForm {
  serial: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  email?: string;
  referredBy: string;
  doctorPhone?: string;
  institution?: string;
  dateCollected: string; // ISO
  natureOfSpecimen: string;
  examinationRequired: string;
  testsRequested: string[];
  clinicalNotes?: string;
  bill: "Clinic" | "Patient" | "Company";
  status: TestStatus;
  results?: Record<string, string>;
  scientist?: string;
  completedAt?: string;
}

export const MOCK_FORMS: TestForm[] = [
  {
    serial: "MV-2026-00184",
    patientName: "Chinedu Okafor",
    age: 34, gender: "Male", phone: "+234 803 555 0142",
    referredBy: "Dr. A. Bello", doctorPhone: "+234 802 111 0091",
    institution: "St. Luke's Clinic",
    dateCollected: "2026-04-21T08:20:00Z",
    natureOfSpecimen: "Whole Blood, Urine",
    examinationRequired: "FBC, U/E/Cr, Urinalysis",
    testsRequested: ["Full Blood Count (FBC)", "Kidney Function Test", "Urine Microscopy"],
    clinicalNotes: "Persistent fatigue, mild dehydration.",
    bill: "Patient", status: "Pending",
  },
  {
    serial: "MV-2026-00183",
    patientName: "Amaka Eze",
    age: 28, gender: "Female", phone: "+234 815 222 7711",
    referredBy: "Dr. P. Onyema",
    dateCollected: "2026-04-21T07:45:00Z",
    natureOfSpecimen: "Serum",
    examinationRequired: "Female Hormone Profile",
    testsRequested: ["Female Hormone Profile", "Pregnancy Test"],
    bill: "Patient", status: "Processing",
    scientist: "Sci. Obi",
    results: { lh: "5.2", fsh: "6.1", prolactin: "12.4" },
  },
  {
    serial: "MV-2026-00182",
    patientName: "Tunde Balogun",
    age: 45, gender: "Male", phone: "+234 706 909 5512",
    referredBy: "Dr. M. Adeyemi",
    dateCollected: "2026-04-20T14:10:00Z",
    natureOfSpecimen: "Serum",
    examinationRequired: "Lipid Profile, FBS, LFT",
    testsRequested: ["Lipid Profile Test", "Fasting Blood Sugar", "Liver Function Test"],
    bill: "Company", status: "Completed",
    scientist: "Sci. Ngozi",
    completedAt: "2026-04-20T17:30:00Z",
    results: {
      fbs: "5.4", cholesterol: "4.9", triglyceride: "1.4", hdl: "1.1", ldl: "3.0",
      tBilirubin: "12", ast: "22", alt: "25", totalProtein: "70", albumin: "40",
    },
  },
  {
    serial: "MV-2026-00181",
    patientName: "Fatima Yusuf",
    age: 31, gender: "Female", phone: "+234 909 121 3344",
    referredBy: "Dr. K. Ibrahim",
    dateCollected: "2026-04-20T09:00:00Z",
    natureOfSpecimen: "Whole Blood",
    examinationRequired: "Malaria, Widal, FBC",
    testsRequested: ["Malaria Test", "Widal Test", "Full Blood Count (FBC)"],
    bill: "Patient", status: "Completed",
    scientist: "Sci. Obi",
    completedAt: "2026-04-20T11:50:00Z",
    results: { hb: "12.8", pcv: "39", wbc: "7.2", malariaParasite: "Seen (+)", salTyphiO: "1/160" },
  },
  {
    serial: "MV-2026-00180",
    patientName: "Ifeanyi Nwosu",
    age: 52, gender: "Male", phone: "+234 802 555 9090",
    referredBy: "Dr. L. Eze",
    dateCollected: "2026-04-20T08:30:00Z",
    natureOfSpecimen: "Urine",
    examinationRequired: "Urine Culture & Sensitivity",
    testsRequested: ["Urine Culture", "Urine Microscopy"],
    bill: "Clinic", status: "Pending",
  },
  {
    serial: "MV-2026-00179",
    patientName: "Grace Adeyinka",
    age: 26, gender: "Female", phone: "+234 813 700 2211",
    referredBy: "Dr. R. Hassan",
    dateCollected: "2026-04-19T13:15:00Z",
    natureOfSpecimen: "Serum",
    examinationRequired: "TFT, Prolactin",
    testsRequested: ["Thyroid Function test", "Prolactin"],
    bill: "Patient", status: "Processing",
    scientist: "Sci. Ngozi",
  },
];

export const SCIENTISTS = [
  { id: "s1", name: "Sci. Obi Nnamdi", role: "Senior Lab Scientist", email: "obi@medvic.ng", active: true },
  { id: "s2", name: "Sci. Ngozi Eze", role: "Lab Scientist", email: "ngozi@medvic.ng", active: true },
  { id: "s3", name: "Sci. Daniel Ade", role: "Lab Scientist", email: "daniel@medvic.ng", active: true },
  { id: "s4", name: "Sci. Halima Bako", role: "Junior Scientist", email: "halima@medvic.ng", active: false },
];
