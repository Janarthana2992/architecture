"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { testimonialsApi, uploadApi, getImageUrl } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import type { Testimonial } from "@/types";

const MAX_MB = 5;

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditing(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: testimonialsApi.adminList,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => testimonialsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast("success", "Testimonial deleted");
    },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      testimonialsApi.update(id, { is_active: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const openEdit = (t: Testimonial) => { setEditing(t); setModalOpen(true); };
  const openNew = () => { setEditing(null); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-cream-100">Testimonials</h1>
          <p className="text-xs text-cream-200/40 mt-1">{testimonials.length} / 10 max</p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus size={14} /> New Testimonial
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-obsidian-800 border border-obsidian-600" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 text-cream-200/30">
            <p>No testimonials yet. Add one to get started.</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-obsidian-800 border border-obsidian-600 p-4 flex items-start gap-4"
            >
              {t.client_photo ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={getImageUrl(t.client_photo)} alt={t.client_name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <span className="text-gold-400 text-sm">{t.client_name.charAt(0)}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-cream-100 text-sm">{t.client_name}</span>
                  {t.client_title && (
                    <span className="text-xs text-cream-200/40">{t.client_title}</span>
                  )}
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill={i < t.rating ? "#C9A96E" : "transparent"}
                        className={i < t.rating ? "text-gold-400" : "text-cream-200/20"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-cream-200/50 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive.mutate({ id: t.id, val: !t.is_active })}
                  className={`p-1.5 transition-colors ${t.is_active ? "text-green-400" : "text-cream-200/30"}`}
                  aria-label={t.is_active ? "Deactivate" : "Activate"}
                >
                  {t.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="p-1.5 text-cream-200/40 hover:text-gold-400 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { if (confirm("Delete testimonial?")) deleteMut.mutate(t.id); }}
                  className="p-1.5 text-cream-200/40 hover:text-red-400 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Testimonial" : "New Testimonial"}
      >
        <TestimonialForm
          testimonial={editing}
          onSuccess={() => {
            setModalOpen(false);
            qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
          }}
        />
      </Modal>
    </div>
  );
}

function TestimonialForm({
  testimonial,
  onSuccess,
}: {
  testimonial: Testimonial | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    client_name: testimonial?.client_name ?? "",
    client_title: testimonial?.client_title ?? "",
    content: testimonial?.content ?? "",
    rating: testimonial?.rating ?? 5,
    project_name: testimonial?.project_name ?? "",
    is_active: testimonial?.is_active ?? true,
    client_photo: testimonial?.client_photo ?? "",
    sort_order: testimonial?.sort_order ?? 0,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const uploadPhoto = async (file: File) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      toast("error", `Image too large. Max ${MAX_MB}MB`);
      return;
    }
    setUploading(true);
    try {
      const res = await uploadApi.image(file, "testimonial", "testimonials");
      update("client_photo", res.url);
    } catch {
      toast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (testimonial) {
        await testimonialsApi.update(testimonial.id, form);
        toast("success", "Testimonial updated");
      } else {
        await testimonialsApi.create(form as any);
        toast("success", "Testimonial created");
      }
      onSuccess();
    } catch (err: any) {
      toast("error", err?.response?.data?.detail ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Client Name *" value={form.client_name} onChange={(e) => update("client_name", e.target.value)} />
        <Input label="Title / Company" value={form.client_title} onChange={(e) => update("client_title", e.target.value)} />
      </div>
      <Textarea label="Testimonial Text *" rows={4} value={form.content} onChange={(e) => update("content", e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-1.5">Rating (1–5)</label>
          <select
            className="w-full px-3 py-2.5 text-sm bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500"
            value={form.rating}
            onChange={(e) => update("rating", Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{"★".repeat(r)} ({r})</option>
            ))}
          </select>
        </div>
        <Input label="Related Project (optional)" value={form.project_name} onChange={(e) => update("project_name", e.target.value)} />
      </div>

      {/* Photo upload */}
      <div>
        <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-2">
          Client Photo (400×400, optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
          className="text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
        />
        {form.client_photo && (
          <div className="relative w-12 h-12 mt-2 rounded-full overflow-hidden">
            <Image src={getImageUrl(form.client_photo)} alt="Photo" fill className="object-cover" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
        <input type="checkbox" checked={form.is_active} onChange={(e) => update("is_active", e.target.checked)} className="accent-gold-500" />
        Active (visible on site)
      </label>

      <Button onClick={save} loading={saving || uploading} className="w-full">
        {testimonial ? "Update" : "Create"} Testimonial
      </Button>
    </div>
  );
}
