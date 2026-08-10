// Normal-study report templates. Radiologist loads one and edits as needed.
export type ScanTemplate = {
  findings: string;
  impression: string;
  recommendation: string;
};

// Key format: "<Modality> - <Scan Type>" (case-insensitive match performed in helper)
const TEMPLATES: Record<string, ScanTemplate> = {
  "Ultrasound - Abdomen": {
    findings:
      "LIVER: Normal in size, shape and echotexture. No focal lesion. Intrahepatic biliary radicles are not dilated. Portal vein is normal in calibre.\nGALLBLADDER: Well distended, thin walled. No calculus or sludge seen.\nCBD: Not dilated.\nPANCREAS: Normal in size and echotexture. No focal lesion or peripancreatic collection.\nSPLEEN: Normal in size (___ cm) and echotexture. No focal lesion.\nKIDNEYS: Both kidneys are normal in size, shape and echotexture. Corticomedullary differentiation is preserved. No calculus, mass or hydronephrosis.\n  Right kidney: ___ x ___ cm\n  Left kidney:  ___ x ___ cm\nURINARY BLADDER: Adequately distended, normal wall thickness. No calculus or mass.\nAORTA/IVC: Normal calibre. No para-aortic lymphadenopathy.\nNo free fluid in the abdomen or pelvis.",
    impression: "Essentially normal abdominal ultrasound scan.",
    recommendation: "Clinical correlation. Follow up as clinically indicated.",
  },
  "Ultrasound - Pelvis": {
    findings:
      "URINARY BLADDER: Well distended, smooth wall, no calculus or mass.\nUTERUS: Anteverted, normal in size and echotexture, measures ___ x ___ x ___ cm. Endometrial thickness ___ mm and appears normal for cycle.\nOVARIES: Both ovaries are normal in size and echotexture. Right ovary ___ cc, left ovary ___ cc. No adnexal mass.\nNo free fluid in the pouch of Douglas.",
    impression: "Normal pelvic ultrasound scan.",
    recommendation: "Clinical correlation.",
  },
  "Ultrasound - Obstetric": {
    findings:
      "Single live intrauterine gestation in cephalic/breech presentation.\nFetal cardiac activity present, FHR ___ bpm.\nFetal movement observed.\nBIOMETRY:\n  BPD: ___ mm  (___ wks)\n  HC:  ___ mm  (___ wks)\n  AC:  ___ mm  (___ wks)\n  FL:  ___ mm  (___ wks)\nEstimated fetal weight: ___ g.\nComposite GA: ___ weeks ___ days.\nPlacenta: ___ located, grade ___, clear of the internal os.\nLiquor volume: Adequate (AFI ___ cm).\nCervix appears closed and of normal length.\nNo gross fetal anomaly seen within limits of this study.",
    impression:
      "Single live intrauterine gestation of ___ weeks ___ days with adequate liquor volume and normally located placenta.",
    recommendation: "Routine antenatal follow-up. Repeat scan as clinically indicated.",
  },
  "Ultrasound - Thyroid": {
    findings:
      "Both lobes of the thyroid gland are normal in size, shape and echotexture.\n  Right lobe: ___ x ___ x ___ cm\n  Left lobe:  ___ x ___ x ___ cm\n  Isthmus:    ___ mm\nNo focal nodule, cyst or calcification. Normal vascularity on colour Doppler.\nNo cervical lymphadenopathy.",
    impression: "Normal thyroid ultrasound scan.",
    recommendation: "Clinical and biochemical correlation.",
  },
  "Ultrasound - Prostate": {
    findings:
      "URINARY BLADDER: Adequately distended, smooth wall of normal thickness. No calculus, mass or diverticulum.\nPROSTATE: Normal in size, shape and echotexture with a smooth, well-defined capsule.\n  Dimensions: ___ x ___ x ___ cm\n  Estimated volume: ___ cc (normal < 30 cc)\nNo focal hypoechoic lesion, cyst or calcification within the gland.\nThere is no median lobe indentation into the bladder base.\nSeminal vesicles are symmetrical and normal in appearance.\nPre-void bladder volume: ___ ml.  Post-void residual urine: ___ ml (normal < 20 ml).\nNo peri-prostatic fluid collection or pelvic lymphadenopathy.",
    impression: "Normal prostate ultrasound scan with insignificant post-void residual urine.",
    recommendation: "Clinical correlation with PSA and digital rectal examination as indicated.",
  },
  "Ultrasound - Breast": {
    findings:
      "Bilateral breasts show normal fibroglandular tissue with preserved architecture.\nSkin thickness is normal. No skin retraction or nipple inversion.\nNo dominant solid or cystic mass identified in either breast.\nNo duct ectasia; the retro-areolar regions are unremarkable.\nNo architectural distortion or suspicious microcalcification.\nRIGHT BREAST: No focal lesion in any quadrant.\nLEFT BREAST: No focal lesion in any quadrant.\nBoth axillae show no pathologically enlarged lymph nodes; visualised nodes retain normal fatty hila.",
    impression: "Normal bilateral breast ultrasound scan. BI-RADS 1 (negative).",
    recommendation: "Routine screening and clinical breast examination as age appropriate.",
  },
  "Ultrasound - Transvaginal": {
    findings:
      "Study performed transvaginally with the bladder empty.\nUTERUS: Anteverted/retroverted, normal in size, contour and myometrial echotexture, measures ___ x ___ x ___ cm. No fibroid or focal myometrial lesion.\nENDOMETRIUM: Central, homogeneous and regular, thickness ___ mm — appropriate for the stated cycle day. No intracavitary fluid, polyp or mass.\nCERVIX: Normal in appearance. No nabothian cyst or mass. Length ___ cm.\nRIGHT OVARY: Normal in size and echotexture, measures ___ x ___ x ___ cm (___ cc), with normal follicular activity. No adnexal mass.\nLEFT OVARY: Normal in size and echotexture, measures ___ x ___ x ___ cm (___ cc), with normal follicular activity. No adnexal mass.\nNo hydrosalpinx or adnexal tenderness on probe pressure.\nNo free fluid in the pouch of Douglas.",
    impression: "Normal transvaginal pelvic ultrasound scan.",
    recommendation: "Clinical correlation. Repeat scan as clinically indicated.",
  },
  "__Ultrasound - Thyroid (dup)": {
    findings:
      "Both lobes of the thyroid gland are normal in size, shape and echotexture.\n  Right lobe: ___ x ___ x ___ cm\n  Left lobe:  ___ x ___ x ___ cm\n  Isthmus:    ___ mm\nNo focal nodule, cyst or calcification. Normal vascularity on colour Doppler.\nNo cervical lymphadenopathy.",
    impression: "Normal thyroid ultrasound scan.",
    recommendation: "Clinical and biochemical correlation.",
  },
  "Ultrasound - Doppler": {
    findings:
      "The examined vessels show normal calibre, wall thickness and compressibility.\nColour flow is well demonstrated throughout with normal spectral waveforms.\nNo intraluminal thrombus or significant stenosis identified.\nPeak systolic velocities are within normal limits.",
    impression: "Normal Doppler study of the examined vessels.",
    recommendation: "Clinical correlation.",
  },
  "X-Ray - Chest": {
    findings:
      "The lung fields are clear with no focal consolidation, mass or effusion.\nBoth hila are normal. Cardiac silhouette is within normal limits (CTR < 0.5).\nMediastinum is not widened. Trachea is central.\nBoth costophrenic angles are clear.\nVisualised bony thorax and soft tissues are unremarkable.",
    impression: "Normal chest radiograph.",
    recommendation: "Clinical correlation.",
  },
  "X-Ray - Abdomen": {
    findings:
      "Non-specific bowel gas pattern. No dilated bowel loops or air-fluid levels to suggest obstruction.\nNo free sub-diaphragmatic gas.\nNo abnormal soft tissue mass or calcification.\nVisualised bony structures are unremarkable.",
    impression: "Unremarkable plain abdominal radiograph.",
    recommendation: "Clinical correlation.",
  },
  "CT - Head": {
    findings:
      "No acute intracranial haemorrhage, mass effect or midline shift.\nGrey-white matter differentiation is preserved.\nVentricles, cisterns and sulci are of normal size and configuration for age.\nNo extra-axial collection.\nVisualised paranasal sinuses and mastoid air cells are clear.\nBony calvarium is intact.",
    impression: "Normal non-contrast CT scan of the brain.",
    recommendation: "Clinical correlation.",
  },
};

const NORMALISE = (k: string) => k.trim().toLowerCase();
const INDEX = Object.fromEntries(
  Object.entries(TEMPLATES).map(([k, v]) => [NORMALISE(k), v]),
);

export function getScanTemplate(modality?: string | null, scanType?: string | null): ScanTemplate | null {
  if (!scanType) return null;
  if (modality) {
    const hit = INDEX[NORMALISE(`${modality} - ${scanType}`)];
    if (hit) return hit;
  }
  // Fallback: match by scan type across any modality
  const suffix = NORMALISE(`- ${scanType}`);
  const fallbackKey = Object.keys(INDEX).find((k) => k.endsWith(suffix));
  return fallbackKey ? INDEX[fallbackKey] : null;
}

export function hasScanTemplate(modality?: string | null, scanType?: string | null): boolean {
  return getScanTemplate(modality, scanType) !== null;
}
