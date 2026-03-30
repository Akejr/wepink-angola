export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  type: string;
  categoryId?: string;
  badge?: string;
  description: string;
  scentProfile: string[];
  sizes: { label: string; ml: number; price: number }[];
  details: {
    duration: string;
    ingredients: string;
  };
}

export interface CartItem {
  product: Product;
  selectedSize: { label: string; ml: number; price: number };
  quantity: number;
}
