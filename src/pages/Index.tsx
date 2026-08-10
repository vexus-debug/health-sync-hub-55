import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/Reveal";
import {
  ShieldCheck, Microscope, Truck, Mail, Clock, Award,
  FlaskConical, HeartPulse, Pill, Stethoscope, ArrowRight, Phone, MessageCircle, MapPin,
  Search, CalendarCheck, FlaskRound, FileText, Download, Home, BadgeCheck, Sparkles, Activity, Baby, TestTube
} from "lucide-react";
import heroImg from "@/assets/hero-lab.jpg";
import bloodImg from "@/assets/blood-test.jpg";
import nurseImg from "@/assets/nurse.jpg";
import sampleImg from "@/assets/sample.jpg";
import consultImg from "@/assets/consultation.jpg";
import { SITE, buildWhatsAppLink } from "@/lib/site";

const popularTests = [
  {
    icon: FlaskConical,
    code: "HAE-001",
    title: "Full Blood Count (FBC)",
    category: "Haematology",
    sample: "EDTA whole blood",
    fasting: false,
    tat: "Same day",
    parameters: 22,
  },
  {
    icon: HeartPulse,
    code: "CHE-204",
    title: "Lipid Profile & HbA1c",
    category: "Clinical Chemistry",
    sample: "Serum",
    fasting: true,
    tat: "24 hours",
    parameters: 8,
  },
  {
    icon: ShieldCheck,
    code: "SER-118",
    title: "HIV I & II + Hepatitis B / C",
    category: "Serology",
    sample: "Serum",
    fasting: false,
    tat: "Same day",
    parameters: 4,
  },
  {
    icon: Activity,
    code: "END-307",
    title: "Thyroid Function (TSH, T3, T4)",
    category: "Endocrinology",
    sample: "Serum",
    fasting: false,
    tat: "48 hours",
    parameters: 3,
  },
  {
    icon: Baby,
    code: "REP-411",
    title: "Seminal Fluid Analysis",
    category: "Reproductive Health",
    sample: "Semen",
    fasting: false,
    tat: "24 hours",
    parameters: 12,
  },
  {
    icon: TestTube,
    code: "PAR-052",
    title: "Malaria Parasite & Widal",
    category: "Parasitology",
    sample: "Whole blood",
    fasting: false,
    tat: "Same day",
    parameters: 2,
  },
];

const testCategories = [
  "All tests",
  "Haematology",
  "Clinical Chemistry",
  "Serology",
  "Endocrinology",
  "Reproductive Health",
  "Parasitology",
];

const trust = [
  { icon: BadgeCheck, label: "Licensed Lab" },
  { icon: ShieldCheck, label: "100% Confidential" },
  { icon: Award, label: "Qualified Clinicians" },
  { icon: Sparkles, label: "Modern Equipment" },
];

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Select your test",
    desc: "Browse our catalogue of 200+ tests or speak with a clinician to identify the appropriate panel.",
    meta: "5–10 min consult",
  },
  {
    n: "02",
    icon: CalendarCheck,
    title: "Book your appointment",
    desc: "Schedule online, walk in during clinic hours, or request a confidential home sample collection.",
    meta: "Same-day slots available",
  },
  {
    n: "03",
    icon: FlaskRound,
    title: "Sample collection & analysis",
    desc: "Samples are collected by certified phlebotomists and processed by qualified medical scientists.",
    meta: "Chain-of-custody tracked",
  },
  {
    n: "04",
    icon: FileText,
    title: "Verified results delivered",
    desc: "Reports are reviewed and signed by a consultant before secure delivery via email, WhatsApp or in-person.",
    meta: "Avg. turnaround: 24 hrs",
  },
];

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Medvic Goodhealth — Confidential Medical Laboratory in Port Harcourt"
        description="MLSCN-licensed medical laboratory in Rumuokwachi, Port Harcourt offering confidential lab tests, consultations, pharmacy and home sample collection. Your Health. Your Privacy. Your Choice."
        keywords="medical laboratory Port Harcourt, lab tests Rivers State, confidential lab Nigeria, blood test Port Harcourt, home sample collection, Medvic Goodhealth"
      />
      {/* 1. HERO — clinical, full-bleed, calm */}
      <section className="relative isolate overflow-hidden bg-background">
        {/* Background image with deep clinical overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        <div className="container relative pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-44 lg:pb-36 text-primary-foreground">
          <div className="max-w-3xl space-y-7 animate-fade-up">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 backdrop-blur border border-white/20 font-medium uppercase tracking-[0.18em]">
                <BadgeCheck className="h-3.5 w-3.5" /> Licensed Medical Laboratory
              </span>
              <span className="inline-flex items-center gap-2 text-primary-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Open today · Walk-ins welcome
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Diagnostics you can <span className="italic font-medium text-accent">trust</span>,
              <br className="hidden sm:block" /> care that respects your privacy.
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/85 max-w-2xl leading-relaxed">
              Medvic Goodhealth is a full-service medical laboratory in Port Harcourt — delivering accurate results, qualified clinicians, and complete confidentiality at every step.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 font-semibold">
                <Link to="/book">Book a Test <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white/40 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground">
                <Link to="/services">View Test Catalogue</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-4 text-sm text-primary-foreground/85">
              <a href={`tel:${SITE.phones[0].replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-primary-foreground">
                <Phone className="h-4 w-4" /> {SITE.phones[0]}
              </a>
              <span className="h-4 w-px bg-white/20 hidden sm:block" />
              <a href={buildWhatsAppLink("Hello Medvic, I'd like to book a test.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary-foreground">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <span className="h-4 w-px bg-white/20 hidden sm:block" />
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Rumuokwachi, Port Harcourt
              </span>
            </div>
          </div>

          {/* Trust stat strip */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/15 backdrop-blur border border-white/15">
            {[
              { k: "200+", v: "Tests offered" },
              { k: "15+ yrs", v: "Clinical experience" },
              { k: "24 hr", v: "Avg. turnaround" },
              { k: "100%", v: "Confidential" },
            ].map((s) => (
              <div key={s.v} className="bg-primary/40 backdrop-blur p-5 md:p-6">
                <p className="font-display text-2xl md:text-3xl font-bold tracking-tight">{s.k}</p>
                <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS — clinical process */}
      <section className="relative py-20 md:py-28 bg-background border-y border-border/60">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left column: section intro */}
            <Reveal variant="right" className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary font-semibold">
                <span className="h-px w-8 bg-primary" />
                The Process
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                A standardised pathway from request to verified report.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every sample at Medvic Goodhealth follows a documented, ISO-aligned workflow — handled by qualified medical scientists and reviewed by consultant pathologists before release.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-soft text-primary text-xs font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Quality assured
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Confidential
                </span>
              </div>
              <div className="pt-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/book">Begin your test request <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </Reveal>

            {/* Right column: numbered process list */}
            <ol className="lg:col-span-8 relative">
              <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
              {steps.map((s, i) => (
                <Reveal as="li" key={s.n} variant="left" delay={i * 90} className="relative group pl-20 pr-2 py-6 md:py-7 border-b border-border/60 last:border-b-0 block">
                  {/* Step number marker */}
                  <div className="absolute left-0 top-6 md:top-7 flex flex-col items-center">
                    <div className="relative h-14 w-14 rounded-full bg-background border border-border grid place-items-center group-hover:border-primary transition-smooth">
                      <s.icon className="h-5 w-5 text-primary" />
                      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center font-mono">
                        {s.n}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6">
                    <div className="flex-1">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                        Step {s.n} {i < steps.length - 1 && "→"}
                      </p>
                      <h3 className="font-display font-bold text-lg md:text-xl text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                        {s.desc}
                      </p>
                    </div>
                    <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-[11px] font-mono font-semibold whitespace-nowrap self-start">
                      <Clock className="h-3 w-3" />
                      {s.meta}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 md:py-28 border-y border-border bg-muted/30">
        <div className="container">
          <Reveal variant="up" className="max-w-3xl mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Why choose Medvic Goodhealth</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mt-3 text-foreground">
              Diagnostics built on clinical precision and patient confidentiality.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              A fully licensed medical laboratory operated by qualified scientists and consulting clinicians — with quality-controlled processes at every stage of testing.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              { icon: BadgeCheck, title: "Licensed laboratory", desc: "Operating under MLSCN regulatory standards with documented quality protocols." },
              { icon: ShieldCheck, title: "Strict confidentiality", desc: "Chain-of-custody handling and secure, patient-only result delivery." },
              { icon: Award, title: "Qualified clinicians", desc: "Reports reviewed and signed off by experienced consultants before release." },
              { icon: Sparkles, title: "Modern equipment", desc: "Calibrated analysers and validated methods aligned with ISO 15189 principles." },
            ].map((t, i) => (
              <Reveal key={t.title} variant="up" delay={i * 90} className="bg-background p-7">
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center mb-5">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-border pt-10">
            {[
              { v: "15+", l: "Years of clinical practice" },
              { v: "200+", l: "Tests in our catalogue" },
              { v: "24h", l: "Standard turnaround" },
              { v: "98%", l: "Patient satisfaction" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl font-bold text-primary">{s.v}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-10">
            <Button asChild size="lg"><Link to="/about">About the Lab</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/services">Our Standards</Link></Button>
          </div>
        </div>
      </section>

      {/* 4. QUICK TEST SEARCH — full width */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
                <Search className="h-4 w-4" /> Find a test
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                What test are you looking for today?
              </h2>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                Search 200+ accredited lab tests — from full blood counts to fertility and hormonal assays.
              </p>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <form
                onSubmit={(e) => { e.preventDefault(); window.location.href = "/services"; }}
                className="flex items-center gap-2 bg-background rounded-xl p-2 shadow-elegant"
              >
                <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
                <Input
                  type="search"
                  placeholder="e.g. Full Blood Count, HIV, Thyroid…"
                  className="flex-1 border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground bg-transparent"
                />
                <Button type="submit" size="lg" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">Search</Button>
              </form>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-primary-foreground/70 self-center mr-1">Popular:</span>
                {["Malaria", "HIV Test", "Thyroid", "Pregnancy", "Diabetes"].map((t) => (
                  <Link key={t} to="/services" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-smooth border border-white/20 font-medium">{t}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR TESTS — clinical catalogue */}
      <section className="py-20 md:py-28 bg-background border-y border-border/60">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary font-semibold">
                <span className="h-px w-8 bg-primary" />
                Test Directory
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4">
                Frequently requested clinical investigations.
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                A selection from our catalogue of 200+ accredited tests. Each entry shows specimen requirements, fasting status and verified turnaround times.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs text-muted-foreground">{popularTests.length} of 200+</span>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">Full catalogue <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border/60">
            {testCategories.map((cat, i) => (
              <button
                key={cat}
                type="button"
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-smooth border ${
                  i === 0
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Test cards — clinical data layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {popularTests.map((t) => (
              <article
                key={t.code}
                className="group bg-background p-6 hover:bg-secondary/40 transition-smooth flex flex-col"
              >
                {/* Top row: code + category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
                    {t.code}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-primary-soft text-primary">
                    {t.category}
                  </span>
                </div>

                {/* Title */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="h-10 w-10 rounded-lg bg-secondary text-primary grid place-items-center shrink-0 border border-border">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-base md:text-lg leading-snug pt-0.5">
                    {t.title}
                  </h3>
                </div>

                {/* Spec table */}
                <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs mb-5 pb-5 border-b border-border/60">
                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Specimen</dt>
                    <dd className="font-medium text-foreground mt-0.5">{t.sample}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Fasting</dt>
                    <dd className="font-medium text-foreground mt-0.5">{t.fasting ? "Required (8 hrs)" : "Not required"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Parameters</dt>
                    <dd className="font-medium text-foreground mt-0.5 font-mono">{t.parameters}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Turnaround</dt>
                    <dd className="font-medium text-foreground mt-0.5 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.tat}
                    </dd>
                  </div>
                </dl>

                {/* Footer action */}
                <div className="flex items-center justify-between mt-auto">
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-muted-foreground hover:text-primary transition-smooth"
                  >
                    View details
                  </Link>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-smooth"
                  >
                    Request test <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              All tests reviewed and signed off by consultant pathologists prior to release.
            </p>
            <a
              href={buildWhatsAppLink("Hello Medvic, I'd like to enquire about a test not listed.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Can't find your test? Ask a clinician
            </a>
          </div>
        </div>
      </section>

      {/* 6. HOME SAMPLE COLLECTION — clinical, image-free */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left intro */}
            <Reveal variant="right" className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary-foreground/80 font-semibold">
                <span className="h-px w-8 bg-primary-foreground/60" />
                Home Sample Collection
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                Certified phlebotomy at your home or office.
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed">
                A trained phlebotomist visits at your scheduled time with sterile, single-use collection kits. Samples are sealed, labelled and transported under chain-of-custody to our laboratory for analysis.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 font-semibold">
                  <Link to="/book"><Home className="h-4 w-4" /> Request Pickup</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                  <a href={buildWhatsAppLink("Hello Medvic, I'd like to schedule a home sample pickup.")} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> WhatsApp clinician
                  </a>
                </Button>
              </div>
            </Reveal>

            {/* Right: service spec card */}
            <Reveal variant="left" delay={120} className="lg:col-span-7">
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/15 overflow-hidden">
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  {[
                    { icon: Truck, t: "Response time", d: "Within 60 minutes across Port Harcourt" },
                    { icon: ShieldCheck, t: "Sterile equipment", d: "Single-use, factory-sealed kits per visit" },
                    { icon: Clock, t: "Service hours", d: "Monday – Sunday, including public holidays" },
                    { icon: BadgeCheck, t: "Verified staff", d: "ID-checked, MLSCN-certified phlebotomists" },
                  ].map((i) => (
                    <div key={i.t} className="p-6 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/10 text-primary-foreground grid place-items-center shrink-0">
                        <i.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-display font-semibold">{i.t}</p>
                        <p className="text-sm text-primary-foreground/75 mt-1 leading-relaxed">{i.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 bg-white/5 px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-primary-foreground/75">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Chain-of-custody documented from collection to result release.
                  </span>
                  <span className="font-mono">Service area: Port Harcourt & environs</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. DOWNLOAD RESULTS CTA */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-12 shadow-soft">
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
              <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary grid place-items-center mx-auto md:mx-0">
                <FileText className="h-7 w-7" />
              </div>
              <div className="text-center md:text-left">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Patient portal</span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2 text-foreground">Access your test results</h2>
                <p className="mt-2 text-muted-foreground max-w-xl">Sign in with your reference ID and date of birth to securely view and download your encrypted laboratory report.</p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Button asChild size="lg">
                  <Link to="/results"><Download className="h-4 w-4" /> Access Results</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATIONS / CONTACT PREVIEW */}
      <section className="py-20 md:py-28 bg-gradient-soft relative overflow-hidden">
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="container relative">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Visit or call</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Find us — or let us find you.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Our doors are open across Port Harcourt, with a friendly team ready to help.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative rounded-[2.5rem] overflow-hidden border border-border shadow-soft min-h-[360px] bg-background">
              <iframe
                title="Medvic Goodhealth location"
                src="https://www.google.com/maps?q=Rumuokwachi,+Port+Harcourt&output=embed"
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute left-6 bottom-6 max-w-xs bg-background/95 backdrop-blur rounded-2xl p-5 shadow-elegant">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="font-display font-bold">Main Branch</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{SITE.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-3xl p-6 bg-background border border-border hover:shadow-elegant transition-smooth">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <p className="font-display font-bold mb-2">Opening Hours</p>
                <ul className="space-y-1.5 text-sm">
                  {SITE.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-3 text-muted-foreground">
                      <span className="font-medium text-foreground/80">{h.day}</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl p-6 bg-gradient-primary text-primary-foreground hover:shadow-elegant transition-smooth">
                <Phone className="h-6 w-6 mb-3" />
                <p className="font-display font-bold mb-2">Call us anytime</p>
                <ul className="space-y-1.5 text-sm">
                  {SITE.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:underline">{p}</a>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="accent" className="mt-4 w-full">
                  <a href={buildWhatsAppLink("Hello Medvic, I have a question.")} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
