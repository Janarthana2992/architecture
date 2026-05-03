"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { projectsApi, categoriesApi, uploadApi, getImageUrl } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import type { Project } from "@/types";

const IMAGE_TYPES = [
  { value: "project_cover", label: "Cover Image (1200×800)" },
  { value: "project_gallery", label: "Gallery Image (1200×900)" },
];

const MAX_MB = 5;

export default function AdminProjectsPage() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditingProject(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects", page],
    queryFn: () => projectsApi.adminList({ page, page_size: 10 }),
  });

  const projects = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  const deleteMut = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast("success", "Project deleted");
    },
    onError: () => toast("error", "Failed to delete project"),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      projectsApi.update(id, { is_published: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-cream-100">Projects</h1>
          <p className="text-xs text-cream-200/40 mt-1">
            {data?.total ?? 0} / 20 projects · max 5 featured
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={14} /> New Project
        </Button>
      </div>

      {/* Table */}
      <div className="bg-obsidian-800 border border-obsidian-600 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-obsidian-600">
              {["Cover", "Title", "Category", "Year", "Featured", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-cream-200/40 font-medium"
                >
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
                  <td className="px-4 py-3"><div className="h-3 bg-obsidian-700 w-32" /></td>
                  <td colSpan={5} className="px-4 py-3" />
                </tr>
              ))
              : projects.map((p) => (
                <tr key={p.id} className="hover:bg-obsidian-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-14 h-10 shrink-0">
                      <Image
                        src={getImageUrl(p.cover_image)}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="font-medium text-cream-100 truncate block">{p.title}</span>
                    <span className="text-xs text-cream-200/40">{p.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-xs text-cream-200/60">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-cream-200/60">{p.year}</td>
                  <td className="px-4 py-3">
                    {p.is_featured && (
                      <Star size={14} className="text-gold-400" fill="#C9A96E" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish.mutate({ id: p.id, val: !p.is_published })}
                      className={`flex items-center gap-1.5 text-xs ${p.is_published ? "text-green-400" : "text-cream-200/30"
                        }`}
                    >
                      {p.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.is_published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-cream-200/40 hover:text-gold-400 transition-colors"
                        aria-label="Edit project"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?")) deleteMut.mutate(p.id);
                        }}
                        className="p-1.5 text-cream-200/40 hover:text-red-400 transition-colors"
                        aria-label="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-xs text-cream-200/40 self-center">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}

      {/* Project Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Project" : "New Project"}
        className="max-w-2xl"
      >
        <ProjectForm
          project={editingProject}
          onSuccess={() => {
            setModalOpen(false);
            qc.invalidateQueries({ queryKey: ["admin-projects"] });
          }}
        />
      </Modal>
    </div>
  );
}

// ─── Project Form ──────────────────────────────────────────────────────────────

function ProjectForm({
  project,
  onSuccess,
}: {
  project: Project | null;
  onSuccess: () => void;
}) {
  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories", "project"],
    queryFn: () => categoriesApi.list("project"),
  });
  const [form, setForm] = useState({
    title: project?.title ?? "",
    short_description: project?.short_description ?? "",
    description: project?.description ?? "",
    category: project?.category ?? "residential",
    location: project?.location ?? "",
    year: project?.year ?? new Date().getFullYear(),
    project_date: (project as any)?.project_date ?? "",
    area: project?.area ?? "",
    materials: project?.materials ?? "",
    client: project?.client ?? "",
    status: project?.status ?? "completed",
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? true,
    cover_image: project?.cover_image ?? "",
    gallery_images: project?.gallery_images ?? [],
    meta_title: project?.meta_title ?? "",
    meta_description: project?.meta_description ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file: File, type: string) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      toast("error", `Image too large. Max ${MAX_MB}MB`);
      return;
    }
    setUploading(true);
    try {
      const res = await uploadApi.image(file, type, "projects");
      if (type === "project_cover") {
        update("cover_image", res.url);
      } else {
        update("gallery_images", [...form.gallery_images, res.url]);
      }
      toast("success", "Image uploaded");
    } catch {
      toast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (idx: number) => {
    update("gallery_images", form.gallery_images.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (project) {
        await projectsApi.update(project.id, form);
        toast("success", "Project updated");
      } else {
        await projectsApi.create(form as any);
        toast("success", "Project created");
      }
      onSuccess();
    } catch (err: any) {
      toast("error", err?.response?.data?.detail ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Title *" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-1.5">Category</label>
          <select
            className="w-full px-3 py-2.5 text-sm bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categoryList.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <Input label="Location *" value={form.location} onChange={(e) => update("location", e.target.value)} />
        <Input label="Year *" type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} />
        <div>
          <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-1.5">Project Date</label>
          <input
            type="date"
            value={form.project_date}
            onChange={(e) => update("project_date", e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500"
          />
        </div>
        <Input label="Area (e.g. 2,500 m²)" value={form.area} onChange={(e) => update("area", e.target.value)} />
        <div className="col-span-2">
          <Input label="Short Description *" value={form.short_description} onChange={(e) => update("short_description", e.target.value)} />
        </div>
        <div className="col-span-2">
          <Textarea label="Full Description *" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <Input label="Materials (comma-separated)" value={form.materials} onChange={(e) => update("materials", e.target.value)} />
        <Input label="Client" value={form.client} onChange={(e) => update("client", e.target.value)} />
      </div>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} className="accent-gold-500" />
          Featured (max 5)
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => update("is_published", e.target.checked)} className="accent-gold-500" />
          Published
        </label>
      </div>

      {/* Cover image */}
      <div>
        <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-2">
          Cover Image (1200×800, max {MAX_MB}MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "project_cover")}
          className="text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
        />
        {form.cover_image && (
          <div className="relative w-32 h-20 mt-2">
            <Image src={getImageUrl(form.cover_image)} alt="Cover" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-2">
          Gallery Images (1200×900)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={async (e) => {
            const files = e.target.files;
            if (!files?.length) return;
            for (let i = 0; i < files.length; i++) {
              await uploadImage(files[i], "project_gallery");
            }
          }}
          className="text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {form.gallery_images.map((img, i) => (
            <div key={i} className="relative w-20 h-14 group">
              <Image src={getImageUrl(img)} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => removeGalleryImage(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={save} loading={saving || uploading} className="w-full">
        {project ? "Update Project" : "Create Project"}
      </Button>
    </div>
  );
}
