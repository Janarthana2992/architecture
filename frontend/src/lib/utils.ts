import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    residential: "Residential",
    commercial: "Commercial",
    interior: "Interior",
    landscape: "Landscape",
    urban: "Urban Design",
    cultural: "Cultural",
  };
  return labels[category] ?? category;
}

export function getReadTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
