export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  rating: number;
  description: string;
  image: string;
  features: string[];
};

export type ProductQuery = {
  q?: string;
  category?: string;
};
