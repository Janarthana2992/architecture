"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { blogsApi, categoriesApi, uploadApi, getImageUrl } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import type { Blog } from "@/types";

const MAX_MB = 5;

export default function AdminBlogPage() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditing(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs", page],
    queryFn: () => blogsApi.adminList({ page, page_size: 10 }),
  });

  const blogs = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  const deleteMut = useMutation({
    mutationFn: (id: string) => blogsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast("success", "Article deleted");
    },
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      blogsApi.update(id, { is_published: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blogs"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-cream-100">Blog Articles</h1>
          <p className="text-xs text-cream-200/40 mt-1">{data?.total ?? 0} articles</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} size="sm">
          <Plus size={14} /> New Article
        </Button>
      </div>

      <div className="bg-obsidian-800 border border-obsidian-600 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-obsidian-600">
              {["Cover", "Title", "Category", "Author", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-cream-200/40 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-600">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="w-12 h-8 bg-obsidian-700" /></td>
                  <td className="px-4 py-3"><div className="h-3 bg-obsidian-700 w-40" /></td>
                  <td colSpan={5} />
                </tr>
              ))
              : blogs.map((b) => (
                <tr key={b.id} className="hover:bg-obsidian-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-14 h-10">
                      <Image src={getImageUrl(b.cover_image)} alt={b.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="font-medium text-cream-100 truncate block">{b.title}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-cream-200/60">{b.category}</td>
                  <td className="px-4 py-3 text-xs text-cream-200/60">{b.author}</td>
                  <td className="px-4 py-3 text-xs text-cream-200/60">{formatDate(b.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish.mutate({ id: b.id, val: !b.is_published })}
                      className={`flex items-center gap-1.5 text-xs ${b.is_published ? "text-green-400" : "text-cream-200/30"}`}
                    >
                      {b.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {b.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(b); setModalOpen(true); }} className="p-1.5 text-cream-200/40 hover:text-gold-400 transition-colors" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { if (confirm("Delete this article?")) deleteMut.mutate(b.id); }} className="p-1.5 text-cream-200/40 hover:text-red-400 transition-colors" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-xs text-[var(--text-muted)] self-center">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Article" : "New Article"} className="max-w-2xl">
        <BlogForm
          blog={editing}
          onSuccess={() => {
            setModalOpen(false);
            qc.invalidateQueries({ queryKey: ["admin-blogs"] });
          }}
        />
      </Modal>
    </div>
  );
}

function BlogForm({ blog, onSuccess }: { blog: Blog | null; onSuccess: () => void }) {
  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories", "blog"],
    queryFn: () => categoriesApi.list("blog"),
  });
  const [form, setForm] = useState({
    title: blog?.title ?? "",
    excerpt: blog?.excerpt ?? "",
    content: blog?.content ?? "",
    cover_image: blog?.cover_image ?? "",
    author: blog?.author ?? "Ethos Habitats Team",
    category: blog?.category ?? "",
    read_time: blog?.read_time ?? 5,
    tags: blog?.tags ?? "",
    is_published: blog?.is_published ?? true,
    meta_title: blog?.meta_title ?? "",
    meta_description: blog?.meta_description ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const uploadCover = async (file: File) => {
    if (file.size > MAX_MB * 1024 * 1024) { toast("error", `Max ${MAX_MB}MB`); return; }
    setUploading(true);
    try {
      const res = await uploadApi.image(file, "blog_cover", "blogs");
      update("cover_image", res.url);
    } catch { toast("error", "Upload failed"); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (blog) {
        await blogsApi.update(blog.id, form);
        toast("success", "Article updated");
      } else {
        await blogsApi.create(form as any);
        toast("success", "Article created");
      }
      onSuccess();
    } catch (err: any) {
      toast("error", err?.response?.data?.detail ?? "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Input label="Title *" value={form.title} onChange={(e) => update("title", e.target.value)} />
      <Textarea label="Excerpt *" rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Brief summary shown in blog listings…" />
      <Textarea label="Content *" rows={12} value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Write your article content here. Use line breaks for paragraphs…" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Author" value={form.author} onChange={(e) => update("author", e.target.value)} />
        <div>
          <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-1.5">Category</label>
          <select
            className="w-full px-3 py-2.5 text-sm bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select category…</option>
            {categoryList.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <Input label="Read Time (min)" type="number" value={form.read_time} onChange={(e) => update("read_time", Number(e.target.value))} />
        <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
      </div>

      {/* Cover image */}
      <div>
        <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-2">
          Cover Image (1200×628, max {MAX_MB}MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
          className="text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
        />
        {form.cover_image && (
          <div className="relative w-32 h-20 mt-2">
            <Image src={getImageUrl(form.cover_image)} alt="Cover" fill className="object-cover" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
        <input type="checkbox" checked={form.is_published} onChange={(e) => update("is_published", e.target.checked)} className="accent-gold-500" />
        Published
      </label>

      <Button onClick={save} loading={saving || uploading} className="w-full">
        {blog ? "Update" : "Create"} Article
      </Button>
    </div>
  );
}
