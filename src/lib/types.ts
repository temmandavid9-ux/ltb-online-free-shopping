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
  rating: number;
  reviewCount: number;
};

export type Category = {
  id: string;
  name: string;
  icon: React.ElementType;
};

export type RedeemItem = {
  product: Product;
  quantity: number;
};

export type Order = {
    id: string;
    userId: string;
    product: string;
    price: number;
    status: string; 
    date: string; 
    image: string;
};

export type Withdrawal = {
    id: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    accountDetails: string;
    status: string; 
    date: string; 
};

export type Task = {
    id: string; 
    userId: string;
    name: string;
    completed: boolean;
    reward: number;
    taskStartTime?: string; 
    nextTaskUnlockTime?: string; 
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  balance: number;
  orderIds: string[];
  withdrawalIds: string[];
  // Task Status Fields
  step1Status: boolean;
  step2Status: boolean;
  step3Status: boolean;
  // Elite Mode & Gamification
  streakCount: number;
  lastCompletedDate: string | null;
  eliteUnlocked: boolean;
  eliteStartDate: string | null;
  eliteMonthlyCounter: number;
  eliteRewardsAvailable: number;
  redeemedRewardIds: string[];
};

export type RewardRedemption = {
  id: string;
  userId: string;
  giftCardCodeId: string;
  redemptionDate: string;
  rewardType: string;
  value: number;
};
