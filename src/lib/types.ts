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

// This matches docs/backend.json Order
export type Order = {
    id: string;
    userId: string;
    product: string;
    price: number;
    status: string; // 'Pending', 'Approved', 'Rejected', 'Completed'
    date: string; // ISO String
    image: string;
};

// This matches docs/backend.json Withdrawal
export type Withdrawal = {
    id: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    accountDetails: string;
    status: string; // 'Pending', 'Approved', 'Rejected'
    date: string; // ISO String
};

// This matches docs/backend.json Task
export type Task = {
    id: string; // e.g. 'facebook'
    userId: string;
    name: string;
    completed: boolean;
    reward: number;
    taskStartTime?: string; // ISO String
    nextTaskUnlockTime?: string; // ISO String
};
