
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // For showing discounts (Compare at price)
  category: string;
  image: string;
  shortDescription: string;
  fullDescription?: string; // Populated by AI
  rating: number;
  reviewsCount?: number;
  supplier?: 'AliExpress' | 'DSers Verified' | 'Local Warehouse';
  shippingTime?: string;
  shippingPrice?: number; // Cost of shipping
  isHot?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AIStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
