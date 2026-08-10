import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/site";

export const WhatsAppFab = () => (
  <a
    href={buildWhatsAppLink("Hello Medvic Goodhealth, I'd like to make an enquiry.")}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-accent text-accent-foreground shadow-elegant hover:scale-110 transition-smooth"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default WhatsAppFab;
