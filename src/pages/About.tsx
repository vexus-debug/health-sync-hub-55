import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SITE } from "@/lib/site";
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Microscope,
  CheckCircle2,
} from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Confidentiality", desc: "Patient privacy is upheld at every stage of testing and reporting." },
  { icon: Award, title: "Accuracy", desc: "Calibrated equipment, validated methods, and qualified clinicians." },
  { icon: HeartHandshake, title: "Compassion", desc: "Respectful, patient-centred care for every individual we serve." },
  { icon: Sparkles, title: "Convenience", desc: "Walk-in service, home sample collection, and digital reports." },
];

const credentials = [
  "Licensed by the Medical Laboratory Science Council of Nigeria (MLSCN)",
  "Quality-controlled processes aligned with ISO 15189 principles",
  "Qualified medical laboratory scientists and consulting clinicians",
  "Strict chain-of-custody and confidential reporting protocols",
];

const stats = [
  { value: "10,000+", label: "Tests processed annually" },
  { value: "15+", label: "Years of clinical practice" },
  { value: "98%", label: "Patient satisfaction rate" },
  { value: "24h", label: "Standard result turnaround" },
];

const About = () => (
  <Layout>
    <SEO
      title="About Medvic Goodhealth | MLSCN-Licensed Lab in Port Harcourt"
      description="Learn about Medvic Goodhealth Medical Laboratory — our mission, accredited team and commitment to confidential, accurate diagnostic testing in Port Harcourt, Rivers State."
      keywords="about Medvic Goodhealth, medical laboratory Port Harcourt, MLSCN licensed lab, ISO 15189 lab Nigeria, accredited medical lab Rivers State"
    />
    <PageHeader
      eyebrow="About Medvic Goodhealth"
      title="A trusted medical laboratory built on accuracy and discretion."
      subtitle="We are a licensed diagnostic laboratory and healthcare centre in Port Harcourt, providing reliable testing, qualified clinical oversight, and complete patient confidentiality."
    />

    {/* Overview */}
    <section className="py-16 md:py-24 border-b border-border">
      <div className="container grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Who we are</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Clinical-grade diagnostics for the Port Harcourt community.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Medvic Goodhealth Medical Laboratory combines a fully equipped diagnostic laboratory with on-site clinical and pharmaceutical services. We support physicians, hospitals, and individual patients with timely, accurate results across haematology, microbiology, clinical chemistry, endocrinology, and fertility testing.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every sample is handled by trained medical laboratory scientists under strict quality-control protocols, with reports reviewed before release. Our facility is built around two priorities that matter most in diagnostics — clinical precision and patient confidentiality.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild><Link to="/services">View Our Services</Link></Button>
            <Button asChild variant="outline"><Link to="/contact">Contact the Lab</Link></Button>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Microscope className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg">Accreditation & Standards</h3>
            </div>
            <ul className="space-y-3">
              {credentials.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">RC Number</p>
                <p className="font-semibold text-foreground mt-1">{SITE.rcNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">TIN</p>
                <p className="font-semibold text-foreground mt-1">{SITE.tin}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 md:py-20 border-b border-border bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {stats.map((s) => (
            <div key={s.label} className="bg-background p-8 text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 md:py-24 border-b border-border">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our values</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">The principles that guide our practice</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-2xl p-7 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-5">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 md:py-24">
      <div className="container grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Target className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Our Mission</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Accurate, confidential, and accessible diagnostics — every time.
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            To deliver dependable laboratory services that physicians and patients can build healthcare decisions on, with consistent quality and respectful care.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Users className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Our Vision</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
            The most trusted diagnostic partner in Rivers State.
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Recognised for clinical precision, ethical practice, and uncompromising patient confidentiality across every service we provide.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
