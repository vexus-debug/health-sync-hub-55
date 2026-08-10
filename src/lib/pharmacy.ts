export const PHARMACY_CATEGORIES = [
  "Antibiotics",
  "Antimalarials",
  "Analgesics & Antipyretics",
  "Antihistamines & Cold",
  "Vitamins & Supplements",
  "Antacids & GI",
  "Antihypertensives",
  "Antidiabetics",
] as const;

export type PharmacyCategory = typeof PHARMACY_CATEGORIES[number];

export interface PharmacyItem {
  id: string;
  name: string;
  category: string;
  uses: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}
