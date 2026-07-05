"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi, Project } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, X, Terminal, Search, Star, AlertCircle, PlusCircle, UploadCloud } from "lucide-react";

export default function ProjectsTab() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  
  // Custom states for chip lists
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch Projects
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: portfolioApi.getProjects,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: portfolioApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) => portfolioApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: portfolioApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteConfirmId(null);
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      tech_stack: [],
      features: [],
      preview_image_url: "",
      github_url: "",
      demo_url: "",
      is_featured: false,
      display_order: 0,
    });
    setTechInput("");
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({ ...item });
    setTechInput("");
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const current = formData.tech_stack || [];
    if (!current.includes(techInput.trim())) {
      setFormData({ ...formData, tech_stack: [...current, techInput.trim()] });
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    const current = formData.tech_stack || [];
    setFormData({ ...formData, tech_stack: current.filter((t) => t !== tech) });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const current = formData.features || [];
    if (!current.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...current, featureInput.trim()] });
    }
    setFeatureInput("");
  };

  const handleRemoveFeature = (feat: string) => {
    const current = formData.features || [];
    setFormData({ ...formData, features: current.filter((f) => f !== feat) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      display_order: Number(formData.display_order || 0),
    } as Omit<Project, "id">;

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filtered = projects?.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Manage Projects</h1>
          <p className="text-gray-400 text-xs">CRUD settings for featured works catalog.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 cursor-pointer rounded-xl py-5 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Project
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

      {/* Projects Grid Table */}
      <Card className="glass-panel border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 font-mono text-xs animate-pulse">
            Fetching project catalogs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-gray-600" />
            <span>No projects found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/45 border-b border-border/80 text-gray-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{item.title}</td>
                    <td className="px-6 py-4">
                      {item.is_featured ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-[250px] truncate">
                      {Array.isArray(item.tech_stack) ? item.tech_stack.join(", ") : ""}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="my-8 max-w-lg w-full">
            <Card className="glass-panel border-primary/30 rounded-2xl p-6 relative shadow-2xl">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-secondary" />
                  <h4 className="font-bold text-white font-display text-sm">
                    {editingItem ? "Edit" : "Create"} Project
                  </h4>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-400 rounded-lg">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Project Title</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 resize-none font-sans"
                  />
                </div>



                {/* GitHub & Demo URLs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">GitHub Link</label>
                    <input
                      type="text"
                      value={formData.github_url || ""}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Demo Link</label>
                    <input
                      type="text"
                      value={formData.demo_url || ""}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Featured & Display Order */}
                <div className="grid grid-cols-2 gap-4 items-center pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_feat"
                      checked={formData.is_featured || false}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 bg-input border border-border accent-primary rounded cursor-pointer"
                    />
                    <label htmlFor="is_feat" className="text-xs font-mono text-gray-300 cursor-pointer">Feature project</label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order ?? 0}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Tech Stack Chips Entry */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Tech Stack (Enter to Add)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                      placeholder="e.g. FastAPI"
                      className="flex-1 bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                    <Button type="button" onClick={handleAddTech} size="icon" className="bg-muted hover:bg-muted/70 text-white rounded-xl">
                      <PlusCircle className="w-5 h-5 text-gray-300" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {formData.tech_stack?.map((tech) => (
                      <Badge key={tech} className="bg-accent/15 border-accent/30 text-gray-300 font-mono text-[9px] flex items-center gap-1">
                        {tech}
                        <button type="button" onClick={() => handleRemoveTech(tech)} className="text-red-500 font-bold hover:text-red-400">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features Entry */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Key Features (Enter to Add)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                      placeholder="e.g. Contextual Memory"
                      className="flex-1 bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
                    />
                    <Button type="button" onClick={handleAddFeature} size="icon" className="bg-muted hover:bg-muted/70 text-white rounded-xl">
                      <PlusCircle className="w-5 h-5 text-gray-300" />
                    </Button>
                  </div>
                  <ul className="space-y-1.5 pt-1.5">
                    {formData.features?.map((feat) => (
                      <li key={feat} className="flex justify-between items-center bg-card/25 border border-border px-3 py-1.5 rounded-lg text-xs font-mono text-gray-300">
                        <span>{feat}</span>
                        <button type="button" onClick={() => handleRemoveFeature(feat)} className="text-red-500 font-bold hover:text-red-400">×</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Save */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-1.5 mt-8 cursor-pointer"
                >
                  Save Project
                </Button>

              </form>

            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
