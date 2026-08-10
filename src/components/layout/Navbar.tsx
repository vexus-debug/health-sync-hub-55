import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";
import { SITE, buildWhatsAppLink } from "@/lib/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/locations", label: "Locations" },
  { to: "/results", label: "Results" },
  { to: "/shop", label: "Shop" },
  { to: "/pharmacy", label: "Pharmacy" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        scrolled ? "bg-background/85 backdrop-blur-xl shadow-soft" : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Medvic Goodhealth Medical Laboratory logo" className="h-20 md:h-28 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-foreground/75 hover:text-primary hover:bg-primary-soft/60"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Phone className="h-4 w-4" />
            {SITE.phones[0]}
          </a>
          <Button asChild variant="hero" size="sm">
            <Link to="/book">Book a Test</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden p-2 text-primary rounded-md hover:bg-primary-soft transition-smooth"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0 bg-background">
            <SheetHeader className="px-6 py-5 border-b border-border text-left">
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Medvic Goodhealth" className="h-14 w-auto" />
              </SheetTitle>
              <p className="mt-3 text-xs font-semibold tracking-wide text-primary/80">
                Your <span className="text-primary">HEALTH</span>. Your <span className="text-primary">PRIVACY</span>. Your <span className="text-primary">CHOICE</span>.
              </p>
            </SheetHeader>
            <nav className="flex flex-col px-4 py-4 gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-smooth ${
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-foreground/80 hover:bg-muted"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto px-6 py-5 border-t border-border space-y-3">
              <Button asChild variant="hero" className="w-full">
                <Link to="/book">Book a Test</Link>
              </Button>
              <a
                href={`tel:${SITE.phones[0].replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 text-sm font-medium text-primary"
              >
                <Phone className="h-4 w-4" /> {SITE.phones[0]}
              </a>
              <a
                href={buildWhatsAppLink("Hello Medvic, I'd like to make an enquiry.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
