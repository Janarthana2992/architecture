"use client";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { projectsApi, blogsApi, testimonialsApi } from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: projects } = useQuery({ queryKey: ["admin-projects-count"], queryFn: () => projectsApi.adminList({ page_size: 1 }) });
  const { data: blogs } = useQuery({ queryKey: ["admin-blogs-count"], queryFn: () => blogsApi.adminList({ page_size: 1 }) });
  const { data: testimonials } = useQuery({ queryKey: ["admin-testimonials-count"], queryFn: () => testimonialsApi.adminList() });

  const stats = [
    {
      label: "Total Projects",
      value: projects?.total ?? "—",
      limit: 20,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "text-blue-400",
    },
    {
      label: "Blog Articles",
      value: blogs?.total ?? "—",
      icon: FileText,
      href: "/admin/blog",
      color: "text-green-400",
    },
    {
      label: "Testimonials",
      value: testimonials?.length ?? "—",
      limit: 10,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-gold-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-cream-100">Dashboard</h1>
        <p className="text-sm text-cream-200/40 mt-1">Welcome back. Here's an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block bg-obsidian-800 border border-obsidian-600 p-6 hover:border-gold-500/30 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <stat.icon size={20} strokeWidth={1.5} className={stat.color} />
              {stat.limit && (
                <span className="text-[10px] tracking-[0.1em] uppercase text-cream-200/30">
                  / {stat.limit} max
                </span>
              )}
            </div>
            <div className="font-serif text-3xl text-cream-100 mb-1">{stat.value}</div>
            <div className="text-xs text-cream-200/40">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-obsidian-800 border border-obsidian-600 p-6">
        <h2 className="text-sm font-medium text-cream-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Add New Project", href: "/admin/projects?action=new" },
            { label: "Write Blog Post", href: "/admin/blog?action=new" },
            { label: "Add Testimonial", href: "/admin/testimonials?action=new" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="px-4 py-3 border border-obsidian-500 text-xs tracking-[0.12em] uppercase text-cream-200/60 hover:border-gold-500 hover:text-gold-400 transition-all duration-200 text-center"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 p-4 border border-obsidian-600 bg-obsidian-800/50">
        <div className="flex items-start gap-3">
          <TrendingUp size={16} className="text-gold-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-cream-200/50 leading-relaxed">
              <strong className="text-cream-100">Limits:</strong> Max 20 projects, max 5 featured projects, max 10 testimonials.
              Images are auto-resized and converted to WebP on upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
