import { Layout } from "@/components/layout/Layout";
import { ReactNode } from "react";

export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) => (
  <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-20 md:pt-24 md:pb-28">
    <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
    <div className="container relative">
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground max-w-3xl leading-[1.05]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export const PageShell = ({ children }: { children: ReactNode }) => (
  <Layout>{children}</Layout>
);
