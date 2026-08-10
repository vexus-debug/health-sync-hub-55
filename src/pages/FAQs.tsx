import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";

const faqs = [
  { q: "How private are your services?", a: "Privacy is core to who we are. We offer anonymous sample drop-offs, discreet processing, and results sent confidentially by mail or in-person. Your data is never shared with third parties." },
  { q: "Do I need to book ahead?", a: "Walk-ins are welcome during opening hours, but booking ahead — especially for home sample pickups — guarantees faster service and your preferred slot." },
  { q: "Do you offer home sample collection?", a: "Yes. Our medical home services team can collect samples from your address across Port Harcourt. Request a pickup via the booking form, WhatsApp, or phone." },
  { q: "How long do results take?", a: "Most routine tests are ready within 24–48 hours. Specialised tests (e.g., histopathology, hormonal assays) may take 3–7 working days." },
  { q: "How will I receive my results?", a: "You can pick them up in person, request mail/email delivery, or get a secure copy via WhatsApp. An online portal for results download is coming soon." },
  { q: "What payment methods do you accept?", a: "We accept cash, credit, and debit cards. Bank transfers can also be arranged at the front desk." },
  { q: "Do you provide medical fitness certificates?", a: "Yes — we issue medical fitness exams for work, travel, sport, and visa requirements." },
  { q: "Is anonymous testing really anonymous?", a: "Absolutely. You can submit samples without sharing identifying information beyond what's needed for results delivery." },
  { q: "Are your results internationally accepted?", a: "Yes. Our reports follow international laboratory standards and are widely accepted by clinics, employers, and consulates." },
];

const FAQs = () => (
  <Layout>
    <SEO
      title="FAQs | Medvic Goodhealth Medical Laboratory"
      description="Answers to common questions about confidential lab testing, home sample collection, turnaround times, payments and result delivery at Medvic Goodhealth Port Harcourt."
      keywords="medical lab FAQs, anonymous lab testing Nigeria, home sample collection Port Harcourt, lab results turnaround"
    />
    <PageHeader
      eyebrow="FAQs"
      title="Answers to questions you might have."
      subtitle="If you don't find what you need, our team is just a call or WhatsApp message away."
    />

    <section className="py-16">
      <div className="container max-w-3xl">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-2xl px-6 shadow-soft data-[state=open]:shadow-elegant data-[state=open]:border-primary/30 transition-smooth">
              <AccordionTrigger className="text-left font-display font-semibold py-5 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-3xl bg-gradient-soft border border-border p-8 text-center">
          <h3 className="font-display text-2xl font-bold">Still have a question?</h3>
          <p className="text-muted-foreground mt-2">We're happy to help with anything from test prep to pickups.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero"><Link to="/contact">Contact Us</Link></Button>
            <Button asChild variant="outline"><Link to="/book">Book a Test</Link></Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default FAQs;
