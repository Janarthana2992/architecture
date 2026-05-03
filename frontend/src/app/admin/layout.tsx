"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  LogOut, Menu, X, ChevronRight, Sun, Moon, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen, exact: false },
  { href: "/admin/blog", label: "Blog", icon: FileText, exact: false },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, exact: false },
  { href: "/admin/categories", label: "Categories", icon: Tag, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Default admin to dark on first visit
  useEffect(() => {
    if (mounted && !localStorage.getItem("admin-theme-set")) {
      setTheme("dark");
      localStorage.setItem("admin-theme-set", "1");
    }
  }, [mounted, setTheme]);

  useEffect(() => {
    const token = localStorage.getItem("arch_admin_token");
    const name = localStorage.getItem("arch_admin_name");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminName(name ?? "Admin");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("arch_admin_token");
    localStorage.removeItem("arch_admin_name");
    localStorage.removeItem("arch_admin_email");
    router.push("/admin/login");
  };

  const isActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text-primary)] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[var(--bg-alt)] border-r border-[var(--border)] transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <Link href="/admin" className="font-serif text-lg">
            <span className="text-gold-400">ETHOS</span>
            <span className="text-[var(--text-muted)] text-sm ml-1">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 group",
                      active
                        ? "bg-gold-500/15 text-gold-400 border-l-2 border-gold-500"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] border-l-2 border-transparent"
                    )}
                  >
                    <item.icon size={16} strokeWidth={1.5} />
                    {item.label}
                    {active && (
                      <ChevronRight size={12} className="ml-auto text-gold-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / logout */}
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
              <span className="text-gold-400 text-xs font-medium">
                {adminName.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[var(--text-primary)] truncate">{adminName}</p>
              <p className="text-xs text-[var(--text-muted)]">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-[var(--bg-alt)] border-b border-[var(--border)] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-sm border border-[var(--border)] text-[var(--text-muted)] hover:text-gold-400 hover:border-gold-500/40 transition-all duration-200"
                aria-label="Toggle theme"
                title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {resolvedTheme === "dark" ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
              </button>
            )}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-gold-400 transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 md:p-8"
          >
            <Suspense fallback={null}>{children}</Suspense>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
