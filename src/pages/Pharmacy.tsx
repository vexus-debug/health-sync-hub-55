import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Pill, Stethoscope, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { PHARMACY_CATEGORIES, type PharmacyItem } from "@/lib/pharmacy";
import { SITE, buildWhatsAppLink } from "@/lib/site";

const fetchActive = async (): Promise<PharmacyItem[]> => {
  const { data, error } = await supabase
    .from("pharmacy_items" as any)
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as PharmacyItem[];
};

const Pharmacy = () => {
  const [tab, setTab] = useState<string>("All");
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["pharmacy-items"],
    queryFn: fetchActive,
  });

  const filtered = useMemo(
    () => (tab === "All" ? items : items.filter((p) => p.category === tab)),
    [items, tab],
  );

  const askPhysicianMsg = `Hello ${SITE.name}, I'd like to consult a physician about a medication. Please advise.`;
  const prescriptionMsg = `Hello ${SITE.name}, I'd like to request a prescription. Here are my details:\n\n• Name:\n• Age:\n• Symptoms:\n• Existing conditions / allergies:\n\nThank you.`;

  return (
    <Layout>
      <SEO
        title="Pharmacy Department | Medvic Goodhealth"
        description="Browse commonly prescribed medications. Ask a physician or request a prescription via WhatsApp."
      />
      <PageHeader
        eyebrow="Pharmacy Department"
        title="Pharmacy & Prescriptions"
        subtitle="Browse commonly prescribed medications. Tap any drug to learn its uses, then order on WhatsApp."
      />

      <section className="container py-12">
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Button asChild variant="outline" size="lg" className="h-auto py-4 justify-start">
            <a href={buildWhatsAppLink(askPhysicianMsg)} target="_blank" rel="noreferrer">
              <Stethoscope className="h-5 w-5 mr-3 text-primary" />
              <span className="text-left">
                <span className="block font-semibold">Ask a Physician</span>
                <span className="block text-xs text-muted-foreground">Get professional medical advice</span>
              </span>
            </a>
          </Button>
          <Button asChild variant="hero" size="lg" className="h-auto py-4 justify-start">
            <a href={buildWhatsAppLink(prescriptionMsg)} target="_blank" rel="noreferrer">
              <FileText className="h-5 w-5 mr-3" />
              <span className="text-left">
                <span className="block font-semibold">Ask for a Prescription</span>
                <span className="block text-xs opacity-90">Request via WhatsApp</span>
              </span>
            </a>
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
            <TabsTrigger value="All">All</TabsTrigger>
            {PHARMACY_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
            <Pill className="h-10 w-10 opacity-50" />
            <p>No medications listed in this category yet.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card divide-y divide-border">
            {filtered.map((p) => {
              const message = `Hello ${SITE.name}, I'd like to order from the pharmacy:\n\n• ${p.name}\n\nPlease confirm availability and price.`;
              return (
                <AccordionItem key={p.id} value={p.id} className="border-0 px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="secondary" className="text-[10px] shrink-0">{p.category}</Badge>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.uses || "No description available."}
                    </p>
                    <p className="text-[11px] text-muted-foreground italic">
                      Always consult a qualified physician before use.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="hero" size="sm">
                        <a href={buildWhatsAppLink(message)} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Order on WhatsApp
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={buildWhatsAppLink(askPhysicianMsg)} target="_blank" rel="noreferrer">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          Ask a Physician
                        </a>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </Layout>
  );
};

export default Pharmacy;
