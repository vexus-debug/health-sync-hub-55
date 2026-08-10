export const SITE = {
  name: "Medvic Goodhealth",
  fullName: "Medvic Goodhealth Medical Laboratory",
  tagline: "Your HEALTH. Your PRIVACY. Your CHOICE.",
  phones: ["+234 815 359 3469", "+234 813 558 1946"],
  whatsapp: "2348153593469",
  address: "Plot 1, Road 4, Udo Layout, Beside St. Philip Filling Station, Rumuokwachi, Port Harcourt, Rivers State, Nigeria",
  email: "info@medvicgoodhealth.com",
  rcNumber: "8993592",
  tin: "33691306-0001",
  hours: [
    { day: "Monday", time: "12:00 AM – 9:30 PM" },
    { day: "Tuesday – Saturday", time: "8:00 AM – 9:00 PM" },
    { day: "Sunday", time: "5:00 PM – 12:00 AM" },
  ],
};

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
