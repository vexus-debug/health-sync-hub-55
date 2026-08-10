export const PRODUCT_CATEGORIES = [
  "Lab Equipment",
  "Hospital Equipment",
  "Reagent",
  "General Merchandise",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export interface Product {
  id: string;
  name: string;
  description: string | null;
  uses: string | null;
  price: number | null;
  category: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}
