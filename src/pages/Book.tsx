import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, MessageCircle, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { buildWhatsAppLink } from "@/lib/site";
import { SEO } from "@/components/seo/SEO";

const tests = [
  "Haematology / Full Blood Count",
  "Medical Microbiology",
  "Immunology & Serology",
  "Fertility Testing",
  "Hormonal Assays",
  "Parasitology",
  "Histopathology & Cytology",
  "Clinical Chemistry",
  "General Consultation",
  "Medical Fitness Exam",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  email: z.string().trim().email("Valid email required").max(120).optional().or(z.literal("")),
  tests: z.array(z.string()).min(1, "Please select at least one test"),
  date: z.string().min(1, "Pick a preferred date"),
  time: z.string().optional(),
  pickup: z.boolean().optional(),
  anonymous: z.boolean().optional(),
  address: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

const Book = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const toggleTest = (t: string) =>
    setSelectedTests((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      tests: selectedTests,
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      pickup: fd.get("pickup") === "on",
      anonymous: fd.get("anonymous") === "on",
      address: String(fd.get("address") || ""),
      notes: String(fd.get("notes") || ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errMsg = parsed.error.issues?.[0]?.message ?? "Validation error";
      toast({ title: "Please check the form", description: errMsg, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const lines = [
      "*New Booking — Medvic Goodhealth*",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email && `Email: ${data.email}`,
      `Tests: ${data.tests.join(", ")}`,
      `Preferred date: ${data.date}${data.time ? ` ${data.time}` : ""}`,
      data.pickup && `Home pickup requested${data.address ? ` at: ${data.address}` : ""}`,
      data.anonymous && `Anonymous drop-off: Yes`,
      data.notes && `Notes: ${data.notes}`,
    ].filter(Boolean).join("\n");
    const url = buildWhatsAppLink(lines as string);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      window.open(url, "_blank", "noopener,noreferrer");
      toast({ title: "Opening WhatsApp", description: "Send the pre-filled message to confirm your booking." });
    }, 400);
  };

  return (
    <Layout>
      <SEO
        title="Book a Lab Test | Medvic Goodhealth Port Harcourt"
        description="Book a confidential lab test or request home sample collection in Port Harcourt. Choose your test, pick a time, and we’ll handle the rest — privately and professionally."
        keywords="book lab test Port Harcourt, schedule blood test, home sample pickup Nigeria, Medvic Goodhealth booking"
      />
      <PageHeader
        eyebrow="Book a Test"
        title="Book your appointment in under a minute."
        subtitle="Fill in your details and we'll confirm your booking on WhatsApp. Need help? Call us anytime."
      />
      <section className="py-16">
        <div className="container grid lg:grid-cols-3 gap-10">
          <form onSubmit={onSubmit} className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" name="name" required maxLength={80} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number *</Label>
                <Input id="phone" name="phone" required type="tel" maxLength={20} placeholder="+234 ..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" name="email" type="email" maxLength={120} placeholder="you@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Tests or services * <span className="text-xs text-muted-foreground font-normal">(select one or more)</span></Label>
                {selectedTests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTests.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTest(t)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs"
                      >
                        {t} <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-2 rounded-xl border border-border p-3 max-h-56 overflow-y-auto">
                  {tests.map((t) => (
                    <label key={t} className="flex items-start gap-2 cursor-pointer text-sm">
                      <Checkbox
                        checked={selectedTests.includes(t)}
                        onCheckedChange={() => toggleTest(t)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred date *</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-primary-soft/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox id="pickup" name="pickup" />
                <div>
                  <Label htmlFor="pickup" className="font-semibold">Request home sample pickup</Label>
                  <p className="text-xs text-muted-foreground mt-1">Our team will come to you for collection.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="anonymous" name="anonymous" />
                <div>
                  <Label htmlFor="anonymous" className="font-semibold">Anonymous drop-off</Label>
                  <p className="text-xs text-muted-foreground mt-1">Process my sample with full discretion.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Pickup address (if applicable)</Label>
              <Input id="address" name="address" maxLength={200} placeholder="Street, area, landmark" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" maxLength={500} placeholder="Anything we should know?" rows={4} />
            </div>

            <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full">
              {done ? <><CheckCircle2 className="h-4 w-4" /> Sent — open WhatsApp</> : submitting ? "Preparing…" : <><MessageCircle className="h-4 w-4" /> Submit & Confirm via WhatsApp</>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">By submitting you agree to be contacted regarding your booking. Your information stays private.</p>
          </form>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-7 shadow-elegant">
              <ShieldCheck className="h-8 w-8 mb-3" />
              <h3 className="font-display font-bold text-xl mb-2">100% Confidential</h3>
              <p className="text-sm text-primary-foreground/85">Anonymous drop-offs and discreet processing are always available. Your privacy is our promise.</p>
            </div>
            <div className="rounded-3xl bg-card border border-border p-7">
              <h3 className="font-display font-bold mb-3">What happens next?</h3>
              <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                <li>You submit the form & confirm via WhatsApp.</li>
                <li>We confirm your slot or pickup time.</li>
                <li>Sample is collected & processed securely.</li>
                <li>Results delivered by mail or in-person.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Book;
