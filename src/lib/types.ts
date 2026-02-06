export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  images: { url: string; hint: string }[];
  stock: number;
};

export type Category = {
  id: string;
  name: string;
  icon: React.ElementType;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  }
};
