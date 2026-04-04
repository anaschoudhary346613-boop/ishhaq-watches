import { create } from "zustand";

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: "Processing" | "Shipped" | "Completed";
  createdAt: string;
  items: any[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  description?: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

const mockOrders: Order[] = [
  {
    id: "ORD-1293",
    customerName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    shippingAddress: "123 Luxury Ln, New York, 10001",
    totalAmount: 17000,
    status: "Processing",
    createdAt: new Date().toISOString(),
    items: [
      { name: "Classic Rose Gold Dress Watch", quantity: 1, price: 17000 }
    ]
  }
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Rose Gold Dress Watch",
    brand: "ISHHAQ & CO Classic",
    price: 18500,
    salePrice: 17000,
    imageUrl: "/luxury_watch_1.png",
  },
  {
    id: "2",
    name: "Oceanic Stainless Steel Diver",
    brand: "ISHHAQ & CO Sport",
    price: 14200,
    imageUrl: "/luxury_watch_2.png",
  },
];

export const useAdminStore = create<AdminStore>((set) => ({
  isAuthenticated: false, // Default false to show login screen
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  orders: mockOrders,
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
  products: mockProducts,
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) }))
}));
