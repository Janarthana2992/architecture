"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { categoriesApi } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/types";

const TYPE_TABS = [
    { value: "project", label: "Project Categories" },
    { value: "blog", label: "Blog Categories" },
] as const;

export default function AdminCategoriesPage() {
    const qc = useQueryClient();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState<"project" | "blog">("project");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setEditing(null);
            setModalOpen(true);
        }
    }, [searchParams]);

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["admin-categories", tab],
        queryFn: () => categoriesApi.adminList(tab),
    });

    const deleteMut = useMutation({
        mutationFn: (id: string) => categoriesApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-categories"] });
            // Also invalidate public categories so project/blog forms refresh
            qc.invalidateQueries({ queryKey: ["categories"] });
            toast("success", "Category deleted");
        },
        onError: () => toast("error", "Cannot delete category"),
    });

    const toggleActive = useMutation({
        mutationFn: ({ id, val }: { id: string; val: boolean }) =>
            categoriesApi.update(id, { is_active: val }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-categories"] });
            qc.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-2xl text-[var(--text-primary)]">Categories</h1>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Manage project and blog categories
                    </p>
                </div>
                <Button onClick={() => { setEditing(null); setModalOpen(true); }} size="sm">
                    <Plus size={14} /> New Category
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 bg-[var(--bg-alt)] border border-[var(--border)] w-fit">
                {TYPE_TABS.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTab(t.value)}
                        className={`px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all duration-200 ${tab === t.value
                                ? "bg-gold-500 text-black font-medium"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Category list */}
            <div className="space-y-2">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 bg-[var(--bg-alt)] border border-[var(--border)] animate-pulse" />
                    ))
                ) : categories.length === 0 ? (
                    <div className="text-center py-16 text-[var(--text-muted)]">
                        No {tab} categories yet. Add one to get started.
                    </div>
                ) : (
                    categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-gold-500/20 transition-colors"
                        >
                            {/* Color swatch */}
                            <div
                                className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                                style={{ backgroundColor: cat.color }}
                            />

                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-sm text-[var(--text-primary)]">{cat.name}</span>
                                <span className="text-xs text-[var(--text-muted)] ml-2">/{cat.slug}</span>
                                {cat.description && (
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{cat.description}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border ${cat.is_active
                                        ? "border-green-500/30 text-green-400 bg-green-500/10"
                                        : "border-[var(--border)] text-[var(--text-muted)]"
                                    }`}>
                                    {cat.is_active ? "Active" : "Hidden"}
                                </span>
                                <button
                                    onClick={() => toggleActive.mutate({ id: cat.id, val: !cat.is_active })}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-gold-400 transition-colors"
                                    aria-label={cat.is_active ? "Deactivate" : "Activate"}
                                >
                                    {cat.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button
                                    onClick={() => { setEditing(cat); setModalOpen(true); }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-gold-400 transition-colors"
                                    aria-label="Edit"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteMut.mutate(cat.id); }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
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
                title={editing ? "Edit Category" : "New Category"}
            >
                <CategoryForm
                    category={editing}
                    defaultType={tab}
                    onSuccess={() => {
                        setModalOpen(false);
                        qc.invalidateQueries({ queryKey: ["admin-categories"] });
                        qc.invalidateQueries({ queryKey: ["categories"] });
                    }}
                />
            </Modal>
        </div>
    );
}

function CategoryForm({
    category,
    defaultType,
    onSuccess,
}: {
    category: Category | null;
    defaultType: "project" | "blog";
    onSuccess: () => void;
}) {
    const [form, setForm] = useState({
        name: category?.name ?? "",
        type: (category?.type ?? defaultType) as "project" | "blog",
        color: category?.color ?? "#C9A96E",
        description: category?.description ?? "",
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order ?? 0,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

    const save = async () => {
        if (!form.name.trim()) { setError("Category name is required"); return; }
        setError("");
        setSaving(true);
        try {
            if (category) {
                await categoriesApi.update(category.id, { name: form.name, type: form.type, is_active: form.is_active });
                toast("success", "Category updated");
            } else {
                await categoriesApi.create({ name: form.name, type: form.type, is_active: form.is_active });
                toast("success", "Category created");
            }
            onSuccess();
        } catch (err: any) {
            const msg = err?.response?.data?.detail ?? "Save failed";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
            toast("error", "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            {error && (
                <div className="px-4 py-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
                    {error}
                </div>
            )}

            <Input
                label="Category Name *"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Residential, Interior Design"
            />

            <div>
                <label className="text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)] block mb-1.5">
                    Type
                </label>
                <select
                    className="w-full px-3 py-2.5 text-sm bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-gold-500"
                    value={form.type}
                    onChange={(e) => update("type", e.target.value)}
                    disabled={!!category}
                >
                    <option value="project">Project</option>
                    <option value="blog">Blog</option>
                </select>
                {category && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">Type cannot be changed after creation.</p>
                )}
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => update("is_active", e.target.checked)}
                    className="accent-gold-500"
                />
                Active (visible in filters)
            </label>

            <Button onClick={save} loading={saving} className="w-full">
                {category ? "Update" : "Create"} Category
            </Button>
        </div>
    );
}
