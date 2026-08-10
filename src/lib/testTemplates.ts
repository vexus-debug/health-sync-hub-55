import { LabTest } from "@/lib/labTests";

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  unit?: string;
  range?: string;
  options?: string[];
}

/** Result templates keyed by test name. Every catalog test resolves to a template. */
export const TEST_TEMPLATES: Record<string, TemplateField[]> = {
  "Full Blood Count (FBC)": [
    {
      "key": "hb",
      "label": "Haemoglobin (Hb)",
      "type": "number",
      "unit": "g/dl",
      "range": "12.5 – 16",
      "options": []
    },
    {
      "key": "pcv",
      "label": "PCV",
      "type": "number",
      "unit": "%",
      "range": "37 – 48",
      "options": []
    },
    {
      "key": "rbcCount",
      "label": "RBC Count",
      "type": "number",
      "unit": "x10¹²/L",
      "range": "4.0 – 5.5",
      "options": []
    },
    {
      "key": "mcv",
      "label": "MCV",
      "type": "number",
      "unit": "fl",
      "range": "76 – 96",
      "options": []
    },
    {
      "key": "mch",
      "label": "MCH",
      "type": "number",
      "unit": "pg",
      "range": "27 – 32",
      "options": []
    },
    {
      "key": "mchc",
      "label": "MCHC",
      "type": "number",
      "unit": "g/dl",
      "range": "30 – 35",
      "options": []
    },
    {
      "key": "wbc",
      "label": "WBC (Total)",
      "type": "number",
      "unit": "x10⁹/L",
      "range": "4.0 – 11.0",
      "options": []
    },
    {
      "key": "neutrophils",
      "label": "Neutrophils",
      "type": "number",
      "unit": "%",
      "range": "40 – 75",
      "options": []
    },
    {
      "key": "lymphocytes",
      "label": "Lymphocytes",
      "type": "number",
      "unit": "%",
      "range": "20 – 45",
      "options": []
    },
    {
      "key": "monocytes",
      "label": "Monocytes",
      "type": "number",
      "unit": "%",
      "range": "2 – 10",
      "options": []
    },
    {
      "key": "eosinophils",
      "label": "Eosinophils",
      "type": "number",
      "unit": "%",
      "range": "1 – 6",
      "options": []
    },
    {
      "key": "basophils",
      "label": "Basophils",
      "type": "number",
      "unit": "%",
      "range": "0 – 1",
      "options": []
    },
    {
      "key": "platelets",
      "label": "Platelets",
      "type": "number",
      "unit": "x10⁹/L",
      "range": "150 – 400",
      "options": []
    },
    {
      "key": "filmReport",
      "label": "Film Report / Comment",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Liver Function Test": [
    {
      "key": "tBil",
      "label": "Total Bilirubin",
      "type": "number",
      "unit": "µmol/L",
      "range": "0 – 17.3",
      "options": []
    },
    {
      "key": "dBil",
      "label": "Direct Bilirubin",
      "type": "number",
      "unit": "µmol/L",
      "range": "0 – 4.3",
      "options": []
    },
    {
      "key": "ast",
      "label": "AST (SGOT)",
      "type": "number",
      "unit": "U/L",
      "range": "0 – 37",
      "options": []
    },
    {
      "key": "alt",
      "label": "ALT (SGPT)",
      "type": "number",
      "unit": "U/L",
      "range": "0 – 41",
      "options": []
    },
    {
      "key": "alp",
      "label": "Alkaline Phosphatase",
      "type": "number",
      "unit": "U/L",
      "range": "42 – 128",
      "options": []
    },
    {
      "key": "totalProtein",
      "label": "Total Protein",
      "type": "number",
      "unit": "g/L",
      "range": "58 – 80",
      "options": []
    },
    {
      "key": "albumin",
      "label": "Albumin",
      "type": "number",
      "unit": "g/L",
      "range": "35 – 50",
      "options": []
    },
    {
      "key": "globulin",
      "label": "Globulin",
      "type": "number",
      "unit": "g/L",
      "range": "20 – 35",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Kidney Function Test": [
    {
      "key": "sodium",
      "label": "Sodium",
      "type": "number",
      "unit": "mmol/L",
      "range": "135 – 148",
      "options": []
    },
    {
      "key": "potassium",
      "label": "Potassium",
      "type": "number",
      "unit": "mmol/L",
      "range": "3.5 – 5.5",
      "options": []
    },
    {
      "key": "chloride",
      "label": "Chloride",
      "type": "number",
      "unit": "mmol/L",
      "range": "98 – 110",
      "options": []
    },
    {
      "key": "bicarb",
      "label": "Bicarbonate",
      "type": "number",
      "unit": "mmol/L",
      "range": "23 – 31",
      "options": []
    },
    {
      "key": "urea",
      "label": "Urea",
      "type": "number",
      "unit": "mmol/L",
      "range": "2.0 – 8.0",
      "options": []
    },
    {
      "key": "creatinine",
      "label": "Creatinine",
      "type": "number",
      "unit": "µmol/L",
      "range": "60 – 120",
      "options": []
    },
    {
      "key": "egfr",
      "label": "eGFR",
      "type": "number",
      "unit": "mL/min/1.73m²",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Lipid Profile": [
    {
      "key": "tc",
      "label": "Total Cholesterol",
      "type": "number",
      "unit": "mmol/L",
      "range": "< 5.17",
      "options": []
    },
    {
      "key": "tg",
      "label": "Triglycerides",
      "type": "number",
      "unit": "mmol/L",
      "range": "0.4 – 1.82",
      "options": []
    },
    {
      "key": "hdl",
      "label": "HDL Cholesterol",
      "type": "number",
      "unit": "mmol/L",
      "range": "0.9 – 1.42",
      "options": []
    },
    {
      "key": "ldl",
      "label": "LDL Cholesterol",
      "type": "number",
      "unit": "mmol/L",
      "range": "< 3.36",
      "options": []
    },
    {
      "key": "vldl",
      "label": "VLDL Cholesterol",
      "type": "number",
      "unit": "mmol/L",
      "range": "0.1 – 1.0",
      "options": []
    },
    {
      "key": "ratio",
      "label": "Total Chol / HDL Ratio",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Female Hormone Profile": [
    {
      "key": "lh",
      "label": "LH",
      "type": "number",
      "unit": "mIU/mL",
      "range": "",
      "options": []
    },
    {
      "key": "fsh",
      "label": "FSH",
      "type": "number",
      "unit": "mIU/mL",
      "range": "",
      "options": []
    },
    {
      "key": "prolactin",
      "label": "Prolactin",
      "type": "number",
      "unit": "ng/mL",
      "range": "",
      "options": []
    },
    {
      "key": "estradiol",
      "label": "Estradiol (E2)",
      "type": "number",
      "unit": "pg/mL",
      "range": "",
      "options": []
    },
    {
      "key": "progesterone",
      "label": "Progesterone",
      "type": "number",
      "unit": "ng/mL",
      "range": "",
      "options": []
    },
    {
      "key": "testosterone",
      "label": "Testosterone",
      "type": "number",
      "unit": "ng/mL",
      "range": "",
      "options": []
    },
    {
      "key": "phase",
      "label": "Cycle Phase",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Follicular",
        "Ovulatory",
        "Luteal",
        "Post-Menopausal",
        "Unknown"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Male Hormone Profile": [
    {
      "key": "lh",
      "label": "LH",
      "type": "number",
      "unit": "mIU/mL",
      "range": "",
      "options": []
    },
    {
      "key": "fsh",
      "label": "FSH",
      "type": "number",
      "unit": "mIU/mL",
      "range": "",
      "options": []
    },
    {
      "key": "prolactin",
      "label": "Prolactin",
      "type": "number",
      "unit": "ng/mL",
      "range": "",
      "options": []
    },
    {
      "key": "testosterone",
      "label": "Total Testosterone",
      "type": "number",
      "unit": "ng/mL",
      "range": "",
      "options": []
    },
    {
      "key": "freeTesto",
      "label": "Free Testosterone",
      "type": "number",
      "unit": "pg/mL",
      "range": "",
      "options": []
    },
    {
      "key": "estradiol",
      "label": "Estradiol (E2)",
      "type": "number",
      "unit": "pg/mL",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Semen Analysis": [
    {
      "key": "timeProduced",
      "label": "Time Produced",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "timeExamined",
      "label": "Time Examined",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "abstinence",
      "label": "Days of Abstinence",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "volume",
      "label": "Volume",
      "type": "number",
      "unit": "ml",
      "range": "≥ 1.5",
      "options": []
    },
    {
      "key": "colour",
      "label": "Colour",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "viscosity",
      "label": "Viscosity",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "liquefaction",
      "label": "Liquefaction Time",
      "type": "text",
      "unit": "mins",
      "range": "",
      "options": []
    },
    {
      "key": "ph",
      "label": "pH",
      "type": "number",
      "unit": "",
      "range": "7.2 – 8.0",
      "options": []
    },
    {
      "key": "count",
      "label": "Sperm Count",
      "type": "number",
      "unit": "x10⁶/ml",
      "range": "≥ 15",
      "options": []
    },
    {
      "key": "activeMotile",
      "label": "Active Motile",
      "type": "number",
      "unit": "%",
      "range": "≥ 32",
      "options": []
    },
    {
      "key": "sluggish",
      "label": "Sluggish Motile",
      "type": "number",
      "unit": "%",
      "range": "",
      "options": []
    },
    {
      "key": "nonMotile",
      "label": "Non-Motile",
      "type": "number",
      "unit": "%",
      "range": "",
      "options": []
    },
    {
      "key": "morphology",
      "label": "Normal Morphology",
      "type": "number",
      "unit": "%",
      "range": "≥ 4",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks / Impression",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urine Analysis": [
    {
      "key": "colour",
      "label": "Colour",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "appearance",
      "label": "Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "ph",
      "label": "pH",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sg",
      "label": "Specific Gravity",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "protein",
      "label": "Protein",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Trace",
        "+",
        "++",
        "+++"
      ]
    },
    {
      "key": "glucose",
      "label": "Glucose",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Trace",
        "+",
        "++",
        "+++"
      ]
    },
    {
      "key": "ketones",
      "label": "Ketones",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Trace",
        "+",
        "++",
        "+++"
      ]
    },
    {
      "key": "blood",
      "label": "Blood",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Trace",
        "+",
        "++",
        "+++"
      ]
    },
    {
      "key": "nitrite",
      "label": "Nitrite",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Positive"
      ]
    },
    {
      "key": "leukocytes",
      "label": "Leukocyte Esterase",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Trace",
        "+",
        "++",
        "+++"
      ]
    },
    {
      "key": "bilirubin",
      "label": "Bilirubin",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Negative",
        "Positive"
      ]
    },
    {
      "key": "urobilinogen",
      "label": "Urobilinogen",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urine Microscopy": [
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "casts",
      "label": "Casts",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "crystals",
      "label": "Crystals",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "bacteria",
      "label": "Bacteria",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "trich",
      "label": "Trichomonas Vaginalis",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Widal Test": [
    {
      "key": "salTyphiO",
      "label": "S. Typhi 'O'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "salTyphiH",
      "label": "S. Typhi 'H'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraAO",
      "label": "S. Paratyphi A 'O'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraAH",
      "label": "S. Paratyphi A 'H'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraBO",
      "label": "S. Paratyphi B 'O'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraBH",
      "label": "S. Paratyphi B 'H'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraCO",
      "label": "S. Paratyphi C 'O'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "paraCH",
      "label": "S. Paratyphi C 'H'",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks (Significant titre 1/80)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Stool Analysis": [
    {
      "key": "colour",
      "label": "Colour",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "consistency",
      "label": "Consistency",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Formed",
        "Semi-formed",
        "Loose",
        "Watery"
      ]
    },
    {
      "key": "mucus",
      "label": "Mucus",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "blood",
      "label": "Blood",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "pusCells",
      "label": "Pus Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "ovaCysts",
      "label": "Ova / Cysts Seen",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "parasites",
      "label": "Parasites / Trophozoites",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Stool Microscopy": [
    {
      "key": "colour",
      "label": "Colour",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "consistency",
      "label": "Consistency",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Formed",
        "Semi-formed",
        "Loose",
        "Watery"
      ]
    },
    {
      "key": "mucus",
      "label": "Mucus",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "blood",
      "label": "Blood",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "pusCells",
      "label": "Pus Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "ovaCysts",
      "label": "Ova / Cysts Seen",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "parasites",
      "label": "Parasites / Trophozoites",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Stool Ova and Parasite Examination": [
    {
      "key": "colour",
      "label": "Colour",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "consistency",
      "label": "Consistency",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Formed",
        "Semi-formed",
        "Loose",
        "Watery"
      ]
    },
    {
      "key": "mucus",
      "label": "Mucus",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "blood",
      "label": "Blood",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Present",
        "Absent"
      ]
    },
    {
      "key": "pusCells",
      "label": "Pus Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "ovaCysts",
      "label": "Ova / Cysts Seen",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "parasites",
      "label": "Parasites / Trophozoites",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Stool Culture": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Blood Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Ear Swab Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Eye Swab Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Nasal Swab Culture": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Pus Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Semen Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Sputum Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Throat Swab Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urine Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Wound Swab Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Fungal Culture": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "High Vaginal Swab (HVS) Microscopy, Culture and Sensitivity": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "trich",
      "label": "Trichomonas Vaginalis",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "clue",
      "label": "Clue Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Endocervical Swab": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "gc",
      "label": "Gonococci (GC)",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "clue",
      "label": "Clue Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urethral Swab": [
    {
      "key": "appearance",
      "label": "Macroscopic Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "pusCells",
      "label": "Pus Cells (WBC) /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "epithelial",
      "label": "Epithelial Cells /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "rbc",
      "label": "RBC /hpf",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "yeast",
      "label": "Yeast Cells",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "gramStain",
      "label": "Gram Stain Findings",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "gc",
      "label": "Gonococci (GC)",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "organism",
      "label": "Organism Isolated",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "colonyCount",
      "label": "Colony Count",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "sensitive",
      "label": "Sensitive To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "intermediate",
      "label": "Intermediate To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "resistant",
      "label": "Resistant To (Antibiotics)",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Malaria Test": [
    {
      "key": "rdt",
      "label": "Malaria RDT",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "microscopy",
      "label": "Malaria Parasite (Microscopy)",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Not Seen",
        "Seen (+)",
        "Seen (++)",
        "Seen (+++)"
      ]
    },
    {
      "key": "species",
      "label": "Species",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "—",
        "P. falciparum",
        "P. vivax",
        "P. ovale",
        "P. malariae"
      ]
    },
    {
      "key": "density",
      "label": "Parasite Density",
      "type": "text",
      "unit": "parasites/µL",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Sputum Acid-Fast Bacilli (AFB) Test": [
    {
      "key": "appearance",
      "label": "Sputum Appearance",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "afb",
      "label": "AFB Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Not Seen",
        "Scanty",
        "1+",
        "2+",
        "3+"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "GeneXpert MTB/RIF": [
    {
      "key": "mtb",
      "label": "MTB",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Not Detected",
        "Detected — Very Low",
        "Detected — Low",
        "Detected — Medium",
        "Detected — High"
      ]
    },
    {
      "key": "rif",
      "label": "Rifampicin Resistance",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Not Detected",
        "Detected",
        "Indeterminate"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Tuberculosis Screening": [
    {
      "key": "method",
      "label": "Method",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Sputum AFB",
        "GeneXpert",
        "Mantoux",
        "Chest Findings"
      ]
    },
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Haemoglobin Electrophoresis": [
    {
      "key": "pattern",
      "label": "Genotype Pattern",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "AA",
        "AS",
        "AC",
        "SS",
        "SC",
        "CC",
        "Other"
      ]
    },
    {
      "key": "bands",
      "label": "Bands Observed",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Human Papillomavirus (HPV) Test": [
    {
      "key": "result",
      "label": "HPV DNA",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Detected",
        "Not Detected"
      ]
    },
    {
      "key": "genotypes",
      "label": "Genotype(s) Detected",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "highRisk",
      "label": "High-Risk Type",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Yes",
        "No"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Herpes Simplex Virus Type 1 (HSV-1)": [
    {
      "key": "igg",
      "label": "IgG Antibody",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "igm",
      "label": "IgM Antibody",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "index",
      "label": "Index Value",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "interpretation",
      "label": "Interpretation",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "No prior infection",
        "Past infection",
        "Recent / Acute infection",
        "Equivocal"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Herpes Simplex Virus Type 2 (HSV-2)": [
    {
      "key": "igg",
      "label": "IgG Antibody",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "igm",
      "label": "IgM Antibody",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "index",
      "label": "Index Value",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "interpretation",
      "label": "Interpretation",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "No prior infection",
        "Past infection",
        "Recent / Acute infection",
        "Equivocal"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Microfilaria Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Schistosoma Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Giardia Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urinary Schistosomiasis Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Trichomonas Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Toxoplasma": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Seen",
        "Not Seen"
      ]
    },
    {
      "key": "species",
      "label": "Species / Organism",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "count",
      "label": "Count / Load",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Creatinine Clearance": [
    {
      "key": "volume",
      "label": "24-Hour Urine Volume",
      "type": "number",
      "unit": "ml",
      "range": "",
      "options": []
    },
    {
      "key": "uCreat",
      "label": "Urine Creatinine",
      "type": "number",
      "unit": "µmol/L",
      "range": "",
      "options": []
    },
    {
      "key": "sCreat",
      "label": "Serum Creatinine",
      "type": "number",
      "unit": "µmol/L",
      "range": "",
      "options": []
    },
    {
      "key": "clearance",
      "label": "Creatinine Clearance",
      "type": "number",
      "unit": "mL/min",
      "range": "88 – 137",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "24-Hour Urine Protein": [
    {
      "key": "volume",
      "label": "24-Hour Urine Volume",
      "type": "number",
      "unit": "ml",
      "range": "",
      "options": []
    },
    {
      "key": "conc",
      "label": "Protein Concentration",
      "type": "number",
      "unit": "g/L",
      "range": "",
      "options": []
    },
    {
      "key": "total",
      "label": "Total Protein / 24 hrs",
      "type": "number",
      "unit": "g/24h",
      "range": "< 0.15",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Faecal Occult Blood Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Occult Blood Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "HIV-1 & HIV-2 Screening": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Syphilis Screening - VDRL": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis B Surface Antigen (HBsAg)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis C Antibody (Anti-HCV)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis A IgM Antibody (Anti-HAV IgM)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis B Core Antibody (Anti-HBc)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis B e Antigen (HBeAg)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Hepatitis B Surface Antibody (Anti-HBs)": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Chlamydia Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Gonorrhea Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Reactive",
        "Non-Reactive"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "HIV-1 Viral Load": [
    {
      "key": "copies",
      "label": "HIV-1 RNA",
      "type": "number",
      "unit": "copies/mL",
      "range": "",
      "options": []
    },
    {
      "key": "log",
      "label": "Log₁₀ Value",
      "type": "number",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Target Not Detected",
        "Detected — Suppressed (<1000)",
        "Detected — Unsuppressed (≥1000)"
      ]
    },
    {
      "key": "method",
      "label": "Method / Platform",
      "type": "text",
      "unit": "",
      "range": "",
      "options": []
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Pregnancy Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Urine hCG",
        "Serum β-hCG"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ],
  "Urine Pregnancy Test": [
    {
      "key": "result",
      "label": "Result",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Positive",
        "Negative"
      ]
    },
    {
      "key": "method",
      "label": "Method",
      "type": "select",
      "unit": "",
      "range": "",
      "options": [
        "Urine hCG",
        "Serum β-hCG"
      ]
    },
    {
      "key": "remarks",
      "label": "Remarks",
      "type": "textarea",
      "unit": "",
      "range": "",
      "options": []
    }
  ]
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const NORM_TEMPLATES: Record<string, TemplateField[]> = Object.fromEntries(
  Object.entries(TEST_TEMPLATES).map(([k, v]) => [norm(k), v]),
);

/** Fields for a test — template when defined, otherwise a single field from the test row. */
export function templateFor(test: LabTest): TemplateField[] {
  const t = NORM_TEMPLATES[norm(test.name)];
  if (t) return t;
  return [
    {
      key: "value",
      label: test.name,
      type: test.input_type,
      unit: test.unit ?? undefined,
      range: test.reference_range ?? undefined,
      options: test.options ?? [],
    },
  ];
}

/** Storage key for a single template field inside test_forms.results */
export const fieldKey = (test: LabTest, field: TemplateField) =>
  field.key === "value" ? `lt:${test.id}` : `lt:${test.id}:${field.key}`;
