export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "coffee" | "specialty" | "pastry" | "dessert";
  image: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  status: OrderStatus;
  timestamp: string;
  source: "website" | "mobile";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
