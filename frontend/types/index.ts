// Add this interface
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Your existing interfaces
export interface PropertyImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  city: string;
  location: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  listingType: 'SALE' | 'RENT';
  images: PropertyImage[];
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}