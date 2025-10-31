export type UserRole = 'buyer' | 'provider';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  category: string;
  title: string;
  description?: string;
  price_pkr: number;
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  buyer_id: string;
  service_id: string;
  provider_id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  booking_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ServiceCategory = 'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'cleaning' | 'hvac' | 'masonry' | 'welding';
