import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ShoppingBag } from "lucide-react";
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
import { PRODUCT_CATEGORIES, type Product } from "@/lib/shop";
import { SITE, buildWhatsAppLink } from "@/lib/site";

const fetchActive = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
};

const Shop = () => {
  const [tab, setTab] = useState<string>("All");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchActive,
  });

  const filtered = useMemo(
    () => (tab === "All" ? products : products.filter((p) => p.category === tab)),
    [products, tab],
  );

  return (
    <Layout>
      <SEO
        title="Shop | Medvic Goodhealth"
        description="Order lab & hospital equipment, reagents, and general merchandise via WhatsApp."
      />
      <PageHeader
        eyebrow="Shop"
        title="Order Lab & Medical Products"
        subtitle="Browse our catalog. Tap any item to learn more, then order directly via WhatsApp."
      />

      <section className="container py-12">
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
            <TabsTrigger value="All">All</TabsTrigger>
            {PRODUCT_CATEGORIES.map((c) => (
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
            <ShoppingBag className="h-10 w-10 opacity-50" />
            <p>No products available in this category yet.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card divide-y divide-border">
            {filtered.map((p) => {
              const message = `Hello ${SITE.name}, I'd like to order:\n\n• ${p.name}\n\nPlease share availability and delivery details.`;
              return (
                <AccordionItem key={p.id} value={p.id} className="border-0 px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="secondary" className="text-[10px] shrink-0">{p.category}</Badge>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {p.uses || p.description || "No description available yet."}
                    </p>
                    <Button asChild variant="hero" size="sm">
                      <a href={buildWhatsAppLink(message)} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Order on WhatsApp
                      </a>
                    </Button>
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

export default Shop;
