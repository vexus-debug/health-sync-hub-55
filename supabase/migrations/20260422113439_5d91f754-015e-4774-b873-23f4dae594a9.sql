-- Seed shop products (idempotent: only insert if name doesn't exist)
INSERT INTO public.products (name, category, uses, active)
SELECT v.name, v.category, v.uses, true FROM (VALUES
  -- Lab Equipment (10)
  ('Binocular Microscope', 'Lab Equipment', 'Routine examination of blood films, urine sediments, stool samples and microbiology slides.'),
  ('Centrifuge (Bench-top)', 'Lab Equipment', 'Separates blood serum/plasma from cells; prepares urine and stool samples.'),
  ('Hematology Analyzer (3-part)', 'Lab Equipment', 'Performs full blood count (FBC) including WBC, RBC, Hb, platelets and indices.'),
  ('Semi-Auto Chemistry Analyzer', 'Lab Equipment', 'Runs liver function, kidney function, lipid profile and glucose tests.'),
  ('Auto-Pipettes (set)', 'Lab Equipment', 'Accurate measurement and dispensing of small reagent and sample volumes.'),
  ('ESR Stand & Westergren Tubes', 'Lab Equipment', 'Erythrocyte sedimentation rate measurement for inflammation screening.'),
  ('Water Bath', 'Lab Equipment', 'Incubation of serological tests and reagent warming at controlled temperatures.'),
  ('Laboratory Incubator', 'Lab Equipment', 'Culturing bacterial samples for microbiology and sensitivity testing.'),
  ('Hot Air Oven', 'Lab Equipment', 'Dry-heat sterilization of glassware and metal lab instruments.'),
  ('Autoclave (Vertical)', 'Lab Equipment', 'Steam sterilization of media, instruments and infectious waste.'),
  ('Glucometer with Strips', 'Lab Equipment', 'Rapid bedside blood glucose measurement.'),
  ('Hemoglobin Meter', 'Lab Equipment', 'Quick hemoglobin estimation for anemia screening.'),

  -- Hospital Equipment (10)
  ('Digital Sphygmomanometer', 'Hospital Equipment', 'Non-invasive blood pressure measurement at OPD and wards.'),
  ('Stethoscope (Dual-head)', 'Hospital Equipment', 'Auscultation of heart, lungs and bowel sounds.'),
  ('Pulse Oximeter (Fingertip)', 'Hospital Equipment', 'Non-invasive monitoring of oxygen saturation and pulse rate.'),
  ('Digital Thermometer', 'Hospital Equipment', 'Accurate body temperature measurement.'),
  ('Infrared Forehead Thermometer', 'Hospital Equipment', 'Contactless temperature screening for triage.'),
  ('Examination Couch', 'Hospital Equipment', 'Patient examination and minor procedures in consulting rooms.'),
  ('Wheelchair (Foldable)', 'Hospital Equipment', 'Mobility support for patients within the hospital.'),
  ('Drip Stand', 'Hospital Equipment', 'Hangs IV fluid bags during infusion therapy.'),
  ('Suction Machine (Portable)', 'Hospital Equipment', 'Clears airway secretions in emergencies and during procedures.'),
  ('Nebulizer', 'Hospital Equipment', 'Delivers aerosolized medication for asthma and respiratory conditions.'),
  ('Patient Monitor (Multi-para)', 'Hospital Equipment', 'Continuous monitoring of ECG, SpO2, BP and temperature.'),
  ('Oxygen Concentrator', 'Hospital Equipment', 'Supplies supplemental oxygen to patients with respiratory distress.'),

  -- Reagent (10)
  ('Giemsa Stain', 'Reagent', 'Staining of blood films for malaria parasites and differential WBC count.'),
  ('Field Stain A & B', 'Reagent', 'Rapid staining for thick blood films in malaria diagnosis.'),
  ('Gram Stain Kit', 'Reagent', 'Differentiation of Gram-positive and Gram-negative bacteria.'),
  ('Ziehl-Neelsen Stain Kit', 'Reagent', 'Detection of acid-fast bacilli (TB) in sputum.'),
  ('Widal Test Kit', 'Reagent', 'Serological screening for typhoid (Salmonella) infection.'),
  ('Malaria RDT Cassettes', 'Reagent', 'Rapid diagnostic test for Plasmodium antigens.'),
  ('HIV Determine Test Kit', 'Reagent', 'Rapid screening for HIV-1 and HIV-2 antibodies.'),
  ('Hepatitis B Surface Antigen Kit', 'Reagent', 'Screening for Hepatitis B infection.'),
  ('Pregnancy Test Strips (hCG)', 'Reagent', 'Qualitative detection of pregnancy from urine samples.'),
  ('Urinalysis Reagent Strips (10-parameter)', 'Reagent', 'Screens urine for glucose, protein, ketones, blood, leukocytes, etc.'),
  ('Glucose Reagent (GOD-PAP)', 'Reagent', 'Enzymatic determination of plasma glucose.'),
  ('Cholesterol Reagent (CHOD-PAP)', 'Reagent', 'Quantitative determination of total serum cholesterol.'),

  -- General Merchandise (10)
  ('Disposable Gloves (Latex, Box of 100)', 'General Merchandise', 'Personal protection during patient handling and lab work.'),
  ('Surgical Face Masks (Box of 50)', 'General Merchandise', 'Barrier protection against droplets and infections.'),
  ('Cotton Wool (500g Roll)', 'General Merchandise', 'Wound cleaning, swabbing and venipuncture site preparation.'),
  ('Methylated Spirit (1L)', 'General Merchandise', 'Antiseptic for skin preparation and instrument cleaning.'),
  ('Hand Sanitizer (500ml)', 'General Merchandise', 'Hand hygiene at clinical and lab points of care.'),
  ('Syringes & Needles (Mixed Box)', 'General Merchandise', 'Injections, blood sampling and reagent dispensing.'),
  ('EDTA Vacutainer Tubes (Pack)', 'General Merchandise', 'Whole-blood collection for hematology tests.'),
  ('Plain Vacutainer Tubes (Pack)', 'General Merchandise', 'Serum separation for chemistry and serology.'),
  ('Urine Sample Containers (Pack)', 'General Merchandise', 'Sterile collection of urine specimens.'),
  ('Sharps Disposal Container', 'General Merchandise', 'Safe disposal of needles and other sharps to prevent injury.'),
  ('Examination Gloves (Nitrile, Box)', 'General Merchandise', 'Powder-free protection for sensitive skin and chemical handling.'),
  ('Disposable Lab Coats (Pack)', 'General Merchandise', 'Single-use protective garment for outreach and screening events.')
) AS v(name, category, uses)
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.name = v.name);

-- Seed pharmacy items
INSERT INTO public.pharmacy_items (name, category, uses, active)
SELECT v.name, v.category, v.uses, true FROM (VALUES
  -- Antibiotics
  ('Amoxicillin 500mg Capsules', 'Antibiotics', 'Treats bacterial infections of the chest, throat, ear, urinary tract and skin.'),
  ('Augmentin (Amoxicillin/Clavulanate) 625mg', 'Antibiotics', 'Broad-spectrum antibiotic for sinusitis, pneumonia and resistant infections.'),
  ('Ciprofloxacin 500mg Tablets', 'Antibiotics', 'Treats UTIs, typhoid, gastroenteritis and certain respiratory infections.'),
  ('Azithromycin 500mg Tablets', 'Antibiotics', 'Used for chest infections, throat infections and some STIs.'),
  ('Metronidazole (Flagyl) 400mg', 'Antibiotics', 'Treats anaerobic bacterial infections, dental abscess and amoebiasis.'),
  ('Cefuroxime 500mg Tablets', 'Antibiotics', 'Second-generation cephalosporin for respiratory and urinary infections.'),
  ('Doxycycline 100mg Capsules', 'Antibiotics', 'Used for typhus, chlamydia, acne and as malaria prophylaxis.'),
  ('Erythromycin 500mg Tablets', 'Antibiotics', 'Alternative for penicillin-allergic patients with chest or skin infections.'),

  -- Antimalarials
  ('Artemether/Lumefantrine (Coartem)', 'Antimalarials', 'First-line treatment for uncomplicated Plasmodium falciparum malaria.'),
  ('Artesunate Injection', 'Antimalarials', 'Treatment of severe and complicated malaria in adults and children.'),
  ('Dihydroartemisinin/Piperaquine (P-Alaxin)', 'Antimalarials', 'ACT for uncomplicated malaria; convenient 3-day regimen.'),
  ('Quinine 300mg Tablets', 'Antimalarials', 'Used in malaria when ACTs are contraindicated; also for severe malaria.'),
  ('Sulfadoxine/Pyrimethamine (Fansidar)', 'Antimalarials', 'Intermittent preventive treatment of malaria in pregnancy (IPTp).'),

  -- Analgesics & Antipyretics
  ('Paracetamol 500mg Tablets', 'Analgesics & Antipyretics', 'Relief of mild to moderate pain and fever.'),
  ('Ibuprofen 400mg Tablets', 'Analgesics & Antipyretics', 'NSAID for pain, inflammation, menstrual cramps and fever.'),
  ('Diclofenac 50mg Tablets', 'Analgesics & Antipyretics', 'Relieves musculoskeletal pain, arthritis and post-operative pain.'),
  ('Aspirin 75mg Tablets', 'Analgesics & Antipyretics', 'Low-dose for cardiovascular protection; higher dose for pain and fever.'),
  ('Tramadol 50mg Capsules', 'Analgesics & Antipyretics', 'Moderate to severe pain; prescription-only opioid analgesic.'),

  -- Antihistamines & Cold
  ('Cetirizine 10mg Tablets', 'Antihistamines & Cold', 'Relieves allergies, hay fever, urticaria and itching.'),
  ('Loratadine 10mg Tablets', 'Antihistamines & Cold', 'Non-sedating antihistamine for seasonal allergies.'),
  ('Chlorpheniramine (Piriton) 4mg', 'Antihistamines & Cold', 'Treats allergic reactions; also used for sleep aid effects.'),
  ('Phenylephrine + Paracetamol (Cold Cap)', 'Antihistamines & Cold', 'Symptomatic relief of cold, nasal congestion and headache.'),

  -- Vitamins & Supplements
  ('Vitamin C 1000mg Tablets', 'Vitamins & Supplements', 'Boosts immunity and supports collagen formation.'),
  ('Multivitamin Syrup', 'Vitamins & Supplements', 'Daily nutritional support for children and convalescents.'),
  ('Folic Acid 5mg Tablets', 'Vitamins & Supplements', 'Prevents neural tube defects in pregnancy; treats megaloblastic anemia.'),
  ('Ferrous Sulphate Tablets', 'Vitamins & Supplements', 'Treats and prevents iron-deficiency anemia.'),
  ('Vitamin B-Complex Tablets', 'Vitamins & Supplements', 'Supports energy metabolism and nerve function.'),
  ('Zinc Sulphate Tablets', 'Vitamins & Supplements', 'Adjunct in management of diarrhoea in children; immune support.'),

  -- Antacids & GI
  ('Omeprazole 20mg Capsules', 'Antacids & GI', 'Reduces stomach acid; treats reflux, gastritis and peptic ulcer.'),
  ('Magnesium Trisilicate Tablets', 'Antacids & GI', 'Quick relief of indigestion, heartburn and acid stomach.'),
  ('ORS (Oral Rehydration Salts)', 'Antacids & GI', 'Replaces fluids and electrolytes lost in diarrhoea and vomiting.'),
  ('Loperamide 2mg Capsules', 'Antacids & GI', 'Symptomatic treatment of acute non-infectious diarrhoea.'),
  ('Hyoscine Butylbromide (Buscopan)', 'Antacids & GI', 'Relieves abdominal cramps and menstrual pain.'),

  -- Antihypertensives
  ('Amlodipine 5mg Tablets', 'Antihypertensives', 'Calcium channel blocker for hypertension and angina.'),
  ('Lisinopril 10mg Tablets', 'Antihypertensives', 'ACE inhibitor for hypertension and heart failure.'),
  ('Losartan 50mg Tablets', 'Antihypertensives', 'ARB for hypertension, particularly in diabetic nephropathy.'),
  ('Bendroflumethiazide 2.5mg', 'Antihypertensives', 'Thiazide diuretic for mild hypertension and oedema.'),

  -- Antidiabetics
  ('Metformin 500mg Tablets', 'Antidiabetics', 'First-line oral therapy for type 2 diabetes mellitus.'),
  ('Glibenclamide 5mg Tablets', 'Antidiabetics', 'Sulphonylurea that stimulates insulin secretion in type 2 diabetes.'),
  ('Insulin Mixtard (Vial)', 'Antidiabetics', 'Pre-mixed insulin for daily glycaemic control in diabetes.')
) AS v(name, category, uses)
WHERE NOT EXISTS (SELECT 1 FROM public.pharmacy_items p WHERE p.name = v.name);
