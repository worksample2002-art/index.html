export interface Product {
  id: number | string; // allowing string since firebase IDs become strings
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
  id: number | string;
  name: string;
  role: 'customer' | 'admin';
}

export interface BrandInfo {
  id: string;
  name: string;
  image: string;
}

export interface CompanyInfo {
  establishedDate: string;
  mdName: string;
  mdMessage: string;
  mdImage: string;
  history: string;
}
