import { ReactNode, useEffect, useRef, useState } from "react";

type Variant = "up" | "left" | "right" | "fade" | "scale";

const variantClass: Record<Variant, string> = {
  up: "animate-slide-up",
  left: "animate-slide-left",
  right: "animate-slide-right",
  fade: "animate-fade-in",
  scale: "animate-scale-in",
};

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  threshold?: number;
}

export const Reveal = ({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
  threshold = 0.15,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={`${visible ? variantClass[variant] : "opacity-0"} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Reveal;