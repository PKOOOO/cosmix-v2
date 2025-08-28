// src/app/types.ts
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  userId: string;
  description?: string;
  shortIntro?: string;
  rating: number;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
  categories?: Category[];
  services?: Service[];
}

export interface Image {
  id: string;
  storeId: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  parentServiceId?: string;
  price?: number;
  durationMinutes?: number;
  isPopular: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  parentService?: Service;
  subServices?: Service[];
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  storeId: string;
  bookingTime: string;
  status: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  notes?: string;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  service?: Service;
  store?: Store;
}