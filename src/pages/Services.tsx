import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/components/seo/SEO";
import {
  FlaskConical, Microscope, ShieldCheck, HeartPulse, Baby,
  TestTube, Stethoscope, Pill, ClipboardCheck, Truck, Activity, ScanLine,
  Clock, BadgeCheck, ArrowRight, Beaker, Droplet, Dna, FileText
} from "lucide-react";

const departments = [
  {
    icon: Droplet,
    code: "HAE",
    name: "Haematology",
    summary: "Comprehensive analysis of blood cells, coagulation and bone marrow function for the diagnosis of anaemia, infection and bleeding disorders.",
    panels: [
      { name: "Full Blood Count (FBC)", tat: "Same day", sample: "EDTA whole blood" },
      { name: "Erythrocyte Sedimentation Rate (ESR)", tat: "Same day", sample: "EDTA whole blood" },
      { name: "Coagulation Profile (PT / aPTT / INR)", tat: "24 hours", sample: "Citrated plasma" },
      { name: "ABO & Rhesus Blood Grouping", tat: "Same day", sample: "EDTA whole blood" },
      { name: "Genotype (Hb electrophoresis)", tat: "24 hours", sample: "EDTA whole blood" },
    ],
  },
  {
    icon: Beaker,
    code: "CHE",
    name: "Clinical Chemistry",
    summary: "Quantitative biochemical assays measuring metabolic, organ-function and endocrine markers for chronic disease monitoring.",
    panels: [
      { name: "Lipid Profile", tat: "24 hours", sample: "Serum (fasting)" },
      { name: "Liver Function Test (LFT)", tat: "24 hours", sample: "Serum" },
      { name: "Kidney Function Test (KFT) & Electrolytes", tat: "24 hours", sample: "Serum" },
      { name: "Fasting Blood Glucose & HbA1c", tat: "24 hours", sample: "Whole blood (fasting)" },
      { name: "Uric Acid, Calcium, Magnesium", tat: "24 hours", sample: "Serum" },
    ],
  },
  {
    icon: Microscope,
    code: "MIC",
    name: "Medical Microbiology",
    summary: "Isolation and identification of bacterial, fungal and mycobacterial pathogens with antibiotic sensitivity profiling.",
    panels: [
      { name: "Urine MCS (Microscopy, Culture & Sensitivity)", tat: "48–72 hours", sample: "Mid-stream urine" },
      { name: "Stool MCS & Occult Blood", tat: "48–72 hours", sample: "Stool" },
      { name: "Wound / High Vaginal Swab Culture", tat: "48–72 hours", sample: "Swab" },
      { name: "Sputum AFB & GeneXpert (TB)", tat: "24–72 hours", sample: "Sputum" },
    ],
  },
  {
    icon: ShieldCheck,
    code: "SER",
    name: "Immunology & Serology",
    summary: "Detection of antibodies, antigens and acute-phase reactants for the screening of infectious and autoimmune disease.",
    panels: [
      { name: "HIV I & II Screening (Confidential)", tat: "Same day", sample: "Serum / whole blood" },
      { name: "Hepatitis B Surface Antigen (HBsAg)", tat: "Same day", sample: "Serum" },
      { name: "Hepatitis C Antibody (Anti-HCV)", tat: "Same day", sample: "Serum" },
      { name: "VDRL / Syphilis Screen", tat: "Same day", sample: "Serum" },
      { name: "H. pylori Antibody / Antigen", tat: "24 hours", sample: "Serum / stool" },
    ],
  },
  {
    icon: HeartPulse,
    code: "END",
    name: "Endocrinology & Hormonal Assays",
    summary: "Quantitative measurement of pituitary, thyroid, gonadal and adrenal hormones for diagnostic and treatment-monitoring purposes.",
    panels: [
      { name: "Thyroid Function (TSH, Free T3, Free T4)", tat: "48 hours", sample: "Serum" },
      { name: "Reproductive Hormones (FSH, LH, Prolactin, Estradiol)", tat: "48 hours", sample: "Serum" },
      { name: "Testosterone (Total & Free)", tat: "48 hours", sample: "Serum" },
      { name: "Cortisol (AM / PM)", tat: "48 hours", sample: "Serum" },
      { name: "Beta-hCG (Quantitative Pregnancy)", tat: "Same day", sample: "Serum" },
    ],
  },
  {
    icon: Baby,
    code: "REP",
    name: "Reproductive & Fertility",
    summary: "Specialist evaluation of male and female reproductive health, ovulation tracking and pre-conception screening.",
    panels: [
      { name: "Seminal Fluid Analysis (WHO 2021)", tat: "24 hours", sample: "Semen" },
      { name: "Ovulation Hormone Panel", tat: "48 hours", sample: "Serum" },
      { name: "Pre-conception Screening", tat: "48 hours", sample: "Serum & whole blood" },
      { name: "Antenatal Booking Profile", tat: "48 hours", sample: "Serum & whole blood" },
    ],
  },
  {
    icon: TestTube,
    code: "PAR",
    name: "Parasitology & Tropical Disease",
    summary: "Microscopic and rapid testing for parasitic and tropical infections common to West Africa.",
    panels: [
      { name: "Malaria Parasite (MP) — Microscopy & RDT", tat: "Same day", sample: "Whole blood" },
      { name: "Widal Reaction (Typhoid)", tat: "Same day", sample: "Serum" },
      { name: "Stool Microscopy for Ova & Parasites", tat: "Same day", sample: "Stool" },
    ],
  },
  {
    icon: Dna,
    code: "HIS",
    name: "Histopathology & Cytology",
    summary: "Microscopic examination of tissue and cellular samples by consultant pathologists for definitive diagnosis.",
    panels: [
      { name: "Tissue Biopsy Reporting", tat: "5–7 working days", sample: "Formalin-fixed tissue" },
      { name: "Pap Smear (Cervical Cytology)", tat: "5–7 working days", sample: "Cervical smear" },
      { name: "Fine Needle Aspiration Cytology (FNAC)", tat: "5–7 working days", sample: "Aspirate" },
    ],
  },
];

const clinicalServices = [
  { icon: Stethoscope, name: "General Medical Consultations", desc: "Walk-in and scheduled consultations with qualified clinicians for diagnosis, treatment and referral." },
  { icon: Pill, name: "On-site Pharmacy", desc: "Dispensing of prescribed medications, vaccines and clinical supplies under licensed pharmacist supervision." },
  { icon: ClipboardCheck, name: "Medical Fitness Examinations", desc: "Pre-employment, travel, immigration and sports fitness certification with documented reporting." },
  { icon: Truck, name: "Home Sample Collection", desc: "Certified phlebotomist visit with sterile single-use kits and chain-of-custody transport." },
  { icon: ShieldCheck, name: "Confidential Drop-off & Reporting", desc: "Discreet sample submission and patient-only result release for sensitive diagnostics." },
  { icon: ScanLine, name: "Diagnostic Imaging — Coming Soon", desc: "Ultrasound and basic radiology services launching shortly at the main branch." },
];

const standards = [
  { icon: BadgeCheck, t: "MLSCN-licensed facility", d: "Operating under the regulatory framework of the Medical Laboratory Science Council of Nigeria." },
  { icon: ShieldCheck, t: "Aligned to ISO 15189", d: "Quality management principles for medical laboratory competence and reporting." },
  { icon: FileText, t: "Consultant-signed reports", d: "Every result reviewed and signed by a qualified scientist or pathologist before release." },
  { icon: Clock, t: "Documented turnaround", d: "Standard 24-hour TAT on routine tests; specialist tests reported within stated timelines." },
];

const Services = () => (
  <Layout>
    <SEO
      title="Lab Tests & Services | Medvic Goodhealth Port Harcourt"
      description="Haematology, Clinical Chemistry, Microbiology, Serology, Hormonal Assays, Histopathology and more. Detailed test panels, specimen requirements and turnaround times."
      keywords="lab tests Port Harcourt, full blood count, hormonal assay, microbiology test, histopathology Nigeria, fertility testing, medical fitness exam"
    />
    <PageHeader
      eyebrow="Tests & Services"
      title="A full-service medical laboratory, structured for clinical accuracy."
      subtitle="Eight specialist departments delivering routine and advanced diagnostics — supported by qualified scientists, consultant review and documented quality protocols."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="hero" size="lg"><Link to="/book">Book a Test <ArrowRight className="h-4 w-4" /></Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/contact">Speak to a Clinician</Link></Button>
      </div>
    </PageHeader>

    {/* Standards strip */}
    <section className="py-12 md:py-16 bg-muted/30 border-y border-border">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {standards.map((s, i) => (
            <Reveal key={s.t} variant="up" delay={i * 80} className="bg-background p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="font-display font-semibold text-foreground">{s.t}</p>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Departments */}
    <section className="py-20 md:py-28">
      <div className="container">
        <Reveal variant="up" className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary font-semibold">
            <span className="h-px w-8 bg-primary" />
            Laboratory Departments
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4">
            Specialist disciplines, one accredited laboratory.
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Each department is staffed by qualified medical scientists working with calibrated, validated analysers. Below is a summary of the most-requested investigations per discipline.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {departments.map((d, i) => (
            <Reveal key={d.code} variant={i % 2 === 0 ? "right" : "left"} delay={(i % 2) * 100} className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:shadow-elegant transition-smooth">
              <div className="p-6 md:p-7 border-b border-border bg-secondary/30">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                    <d.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] tracking-wider text-muted-foreground">DEPT-{d.code}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground">{d.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d.summary}</p>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {d.panels.map((p) => (
                  <li key={p.name} className="px-6 md:px-7 py-3.5 flex items-center justify-between gap-4 text-sm hover:bg-muted/40 transition-smooth">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{p.sample}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-primary bg-primary-soft px-2.5 py-1 rounded-md">
                      <Clock className="h-3 w-3" /> {p.tat}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="px-6 md:px-7 py-4 border-t border-border bg-background flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Selected investigations</span>
                <Link to="/book" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-smooth">
                  Request from this department <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Clinical & ancillary services */}
    <section className="py-20 md:py-28 bg-muted/30 border-y border-border">
      <div className="container">
        <Reveal variant="up" className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary font-semibold">
            <span className="h-px w-8 bg-primary" />
            Clinical & Ancillary Services
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4">
            Beyond the laboratory — integrated patient care.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {clinicalServices.map((s, i) => (
            <Reveal key={s.name} variant="scale" delay={i * 70} className="bg-background p-7">
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center mb-5">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <Reveal variant="up" className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary-foreground/80 font-semibold">
            <span className="h-px w-8 bg-primary-foreground/60" />
            Don't see your test?
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4">
            Our catalogue extends well beyond the panels listed here.
          </h2>
          <p className="mt-4 text-primary-foreground/80 leading-relaxed">
            We routinely process over 200 investigations and can arrange specialised referral testing on request. Contact our clinical team for guidance on the appropriate panel for your case.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 font-semibold">
              <Link to="/contact">Speak to a Clinician</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/book">Book Appointment <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  </Layout>
);

export default Services;
