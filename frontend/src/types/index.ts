// ─── API Types ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  location: string;
  year: number;
  area?: string;
  materials?: string;
  client?: string;
  status: "completed" | "ongoing" | "concept";
  cover_image: string;
  gallery_images: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory = string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: "project" | "blog";
  color: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  read_time: number;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title?: string;
  client_photo?: string;
  content: string;
  rating: number;
  project_name?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  service_interest?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  admin_name: string;
  admin_email: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin?: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
