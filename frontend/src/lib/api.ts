import axios from "axios";
import type {
  Project,
  Blog,
  Testimonial,
  Category,
  PaginatedResponse,
  ContactForm,
  AuthToken,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token for admin requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("arch_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (params?: { page?: number; page_size?: number; category?: string }) =>
    apiClient
      .get<PaginatedResponse<Project>>("/projects", { params })
      .then((r) => r.data),

  featured: () =>
    apiClient.get<Project[]>("/projects/featured").then((r) => r.data),

  bySlug: (slug: string) =>
    apiClient.get<Project>(`/projects/${slug}`).then((r) => r.data),

  // Admin
  adminList: (params?: { page?: number; page_size?: number }) =>
    apiClient
      .get<PaginatedResponse<Project>>("/projects/admin/all", { params })
      .then((r) => r.data),

  create: (data: Partial<Project>) =>
    apiClient.post<Project>("/projects", data).then((r) => r.data),

  update: (id: string, data: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────

export const blogsApi = {
  list: (params?: { page?: number; page_size?: number; category?: string }) =>
    apiClient
      .get<PaginatedResponse<Blog>>("/blogs", { params })
      .then((r) => r.data),

  bySlug: (slug: string) =>
    apiClient.get<Blog>(`/blogs/${slug}`).then((r) => r.data),

  // Admin
  adminList: (params?: { page?: number; page_size?: number }) =>
    apiClient
      .get<PaginatedResponse<Blog>>("/blogs/admin/all", { params })
      .then((r) => r.data),

  create: (data: Partial<Blog>) =>
    apiClient.post<Blog>("/blogs", data).then((r) => r.data),

  update: (id: string, data: Partial<Blog>) =>
    apiClient.put<Blog>(`/blogs/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/blogs/${id}`),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonialsApi = {
  list: () =>
    apiClient.get<Testimonial[]>("/testimonials").then((r) => r.data),

  // Admin
  adminList: () =>
    apiClient.get<Testimonial[]>("/testimonials/admin/all").then((r) => r.data),

  create: (data: Partial<Testimonial>) =>
    apiClient.post<Testimonial>("/testimonials", data).then((r) => r.data),

  update: (id: string, data: Partial<Testimonial>) =>
    apiClient.put<Testimonial>(`/testimonials/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/testimonials/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: ContactForm) =>
    apiClient.post("/contact", data).then((r) => r.data),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiClient
      .post<AuthToken>("/auth/login", { email, password })
      .then((r) => r.data),

  logout: () => apiClient.post("/auth/logout"),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: (type?: "project" | "blog") =>
    apiClient
      .get<Category[]>("/categories", { params: type ? { type } : {} })
      .then((r) => r.data),

  adminList: (type?: "project" | "blog") =>
    apiClient
      .get<Category[]>("/categories/admin/all", { params: type ? { type } : {} })
      .then((r) => r.data),

  create: (data: Partial<Category>) =>
    apiClient.post<Category>("/categories", data).then((r) => r.data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

// ─── Upload ────────────────────────────────────────────────────────────────────

export const uploadApi = {
  image: (file: File, image_type: string, subdirectory: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("image_type", image_type);
    form.append("subdirectory", subdirectory);
    return apiClient
      .post<{ url: string }>("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

export const getImageUrl = (path: string) => {
  if (!path) return "/images/placeholder.webp";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

export const getThumbUrl = (path: string) => {
  if (!path) return "/images/placeholder.webp";
  if (path.startsWith("http")) return path;
  // Insert /thumbs/ before the filename
  const parts = path.split("/");
  const filename = parts.pop();
  return `${API_URL}${parts.join("/")}/thumbs/${filename}`;
};
