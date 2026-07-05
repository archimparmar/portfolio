"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi, BlogPost } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, X, Terminal, Search, AlertCircle, FileText, CheckCircle } from "lucide-react";

export default function BlogTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [tagInput, setTagInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch blogs including drafts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: portfolioApi.getAllBlogPostsAdmin,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: portfolioApi.createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPost> }) => portfolioApi.updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: portfolioApi.deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setDeleteConfirmId(null);
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      cover_image: "",
      tags: [],
      is_draft: false,
    });
    setTagInput("");
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BlogPost) => {
    setEditingItem(item);
    setFormData({ ...item });
    setTagInput("");
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const current = formData.tags || [];
    if (!current.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...current, tagInput.trim()] });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    const current = formData.tags || [];
    setFormData({ ...formData, tags: current.filter((t) => t !== tag) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "",
    } as Omit<BlogPost, "id" | "published_at">;

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filtered = posts?.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Manage Blog Posts</h1>
          <p className="text-gray-400 text-xs">CRUD settings for news & technical reviews.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 cursor-pointer rounded-xl py-5 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Write Post
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center bg-input border border-border rounded-xl px-3 py-1.5 max-w-sm">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by title..."
          className="flex-1 bg-transparent text-white outline-none text-xs"
        />
      </div>

      {/* List Table */}
      <Card className="glass-panel border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 font-mono text-xs animate-pulse">
            Fetching journal catalogs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-gray-600" />
            <span>No posts found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/45 border-b border-border/80 text-gray-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{item.title}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-[150px] truncate">{item.slug}</td>
                    <td className="px-6 py-4">
                      {item.is_draft ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">DRAFT</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">PUBLISHED</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenEdit(item)}
                        className="text-gray-400 hover:text-secondary rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="text-red-500 hover:underline font-bold text-[10px]"
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-gray-400 hover:underline text-[10px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="text-gray-400 hover:text-red-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-4xl w-full h-[90vh] flex">
            <Card className="glass-panel border-primary/30 rounded-2xl p-6 relative shadow-2xl flex flex-col w-full">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary animate-pulse" />
                  <h4 className="font-bold text-white font-display text-sm">
                    {editingItem ? "Edit" : "Compose"} BlogPost
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="border-border text-gray-300 hover:text-white"
                  >
                    {previewMode ? "Code Editor" : "Markdown Preview"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-400 rounded-lg">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden space-y-4 pr-1">
                
                {/* Meta Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Post Title</label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Custom URL Slug (Auto-generated if empty)</label>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Cover Image URL</label>
                    <input
                      type="text"
                      value={formData.cover_image || ""}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="is_draft"
                      checked={formData.is_draft || false}
                      onChange={(e) => setFormData({ ...formData, is_draft: e.target.checked })}
                      className="w-4 h-4 bg-input border border-border accent-primary rounded cursor-pointer"
                    />
                    <label htmlFor="is_draft" className="text-xs font-mono text-gray-300 cursor-pointer">Save as Draft (Hide from public view)</label>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Brief Excerpt</label>
                  <input
                    type="text"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    placeholder="Short meta description..."
                  />
                </div>

                {/* Content Editor */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-[150px]">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">Article Content (Markdown supported)</label>
                  
                  {previewMode ? (
                    <div className="flex-1 overflow-y-auto bg-input border border-border rounded-xl p-4 text-xs prose prose-invert font-sans text-gray-300 leading-relaxed max-w-none">
                      {(formData.content || "*No content written yet.*").split("\n\n").map((para, idx) => {
                        if (para.startsWith("###")) {
                          return <h4 key={idx} className="text-sm font-bold text-white pt-2">{para.replace("###", "").trim()}</h4>;
                        }
                        return <p key={idx}>{para.trim()}</p>;
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      className="flex-1 w-full bg-input text-white border border-border rounded-xl p-3 text-xs outline-none focus:border-primary/50 resize-none font-mono leading-relaxed"
                      placeholder="Write your article in markdown here..."
                    />
                  )}
                </div>

                {/* Tag Entry */}
                <div className="space-y-1.5 pt-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tag (Press Enter)..."
                      className="flex-1 bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                    <Button type="button" onClick={handleAddTag} size="sm" className="bg-muted text-gray-300 rounded-xl">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags?.map((t) => (
                      <Badge key={t} className="bg-accent/15 border-accent/30 text-gray-300 font-mono text-[9px] px-2 py-0.5 flex items-center gap-1">
                        {t}
                        <button type="button" onClick={() => handleRemoveTag(t)} className="text-red-500 hover:text-red-400">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Article
                </Button>

              </form>

            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
