import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { SITE, buildWhatsAppLink } from "@/lib/site";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[hsl(278_70%_12%)] via-[hsl(278_60%_18%)] to-[hsl(285_55%_22%)] text-primary-foreground">
      <div className="container py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="bg-background rounded-2xl p-4 inline-block">
            <img src={logo} alt="Medvic Goodhealth" className="h-28 w-auto" />
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/85">
            {SITE.tagline} Confidential, professional medical laboratory & healthcare services in Port Harcourt.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            <li><Link to="/about" className="hover:text-white transition-smooth">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white transition-smooth">Tests & Services</Link></li>
            <li><Link to="/book" className="hover:text-white transition-smooth">Book Appointment</Link></li>
            <li><Link to="/results" className="hover:text-white transition-smooth">Download Results</Link></li>
            <li><Link to="/locations" className="hover:text-white transition-smooth">Locations</Link></li>
            <li><Link to="/faqs" className="hover:text-white transition-smooth">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{SITE.address}</span></li>
            {SITE.phones.map((p) => (
              <li key={p} className="flex gap-3 items-center">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white">{p}</a>
              </li>
            ))}
            <li className="flex gap-3 items-center">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </li>
            <li>
              <a
                href={buildWhatsAppLink("Hello Medvic Goodhealth, I'd like to make an enquiry.")}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-background/15 hover:bg-background/25 transition-smooth"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Hours</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-3">
                <span className="font-medium">{h.day}</span>
                <span className="text-primary-foreground/75 text-right">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container py-5 text-xs text-primary-foreground/70 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</p>
          <p>RC {SITE.rcNumber} • TIN {SITE.tin} • Confidential. Professional. Trusted.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
