import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { SITE, buildWhatsAppLink } from "@/lib/site";
import { SEO } from "@/components/seo/SEO";

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  email: z.string().trim().email("Valid email required").max(120),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2, "Subject required").max(120),
  message: z.string().trim().min(5, "Tell us a little more").max(1000),
});

const Contact = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errMsg = parsed.error.issues?.[0]?.message ?? "Validation error";
      toast({ title: "Please check the form", description: errMsg, variant: "destructive" });
      return;
    }
    const msg = `*Contact Enquiry*\nName: ${data.name}\nEmail: ${data.email}\n${data.phone ? `Phone: ${data.phone}\n` : ""}Subject: ${data.subject}\n\n${data.message}`;
    window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
    toast({ title: "Message ready", description: "Send it on WhatsApp to reach us instantly." });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <SEO
        title="Contact Medvic Goodhealth Lab | Port Harcourt"
        description="Get in touch with Medvic Goodhealth Medical Laboratory in Rumuokwachi, Port Harcourt. Call, WhatsApp or email us to book tests, request home pickup or ask questions."
        keywords="contact Medvic Goodhealth, medical lab Port Harcourt phone, lab WhatsApp Nigeria, book lab test Rivers State"
      />
      <PageHeader
        eyebrow="Contact Us"
        title="We'd love to hear from you."
        subtitle="Reach our team for bookings, results, partnerships, or general questions."
      />

      <section className="py-16">
        <div className="container grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input id="name" name="name" required maxLength={80} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" maxLength={20} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" name="subject" required maxLength={120} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your message *</Label>
                <Textarea id="message" name="message" required maxLength={1000} rows={6} placeholder="How can we help?" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
                <MessageCircle className="h-4 w-4" /> Send Message
              </Button>
            </form>
          </div>

          <aside className="space-y-4">
            <a href={`tel:${SITE.phones[0].replace(/\s/g, "")}`} className="block bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-smooth">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center"><Phone className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Call us</p>
                  {SITE.phones.map((p) => <p key={p} className="font-semibold text-sm">{p}</p>)}
                </div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="block bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-smooth">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center"><Mail className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Email us</p>
                  <p className="font-semibold text-sm break-all">{SITE.email}</p>
                </div>
              </div>
            </a>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center"><MapPin className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Visit us</p>
                  <p className="font-semibold text-sm">{SITE.address}</p>
                </div>
              </div>
            </div>
            <a href={buildWhatsAppLink("Hello Medvic, I'd like to make an enquiry.")} target="_blank" rel="noreferrer" className="block rounded-2xl p-5 bg-gradient-accent text-accent-foreground shadow-soft hover:shadow-elegant transition-smooth">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <div>
                  <p className="text-xs opacity-80">Fastest reply</p>
                  <p className="font-semibold">Chat on WhatsApp</p>
                </div>
              </div>
            </a>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
