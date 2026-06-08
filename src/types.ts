export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  role: 'customer' | 'admin';
}
