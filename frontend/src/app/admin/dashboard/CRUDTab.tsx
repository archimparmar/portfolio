/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X, Terminal, Search, AlertCircle } from "lucide-react";

interface CRUDField {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

interface CRUDConfig {
  entityName: string;
  queryKey: string;
  getFn: () => Promise<any[]>;
  createFn: (data: any) => Promise<any>;
  updateFn: (id: number, data: any) => Promise<any>;
  deleteFn: (id: number) => Promise<void>;
  fields: CRUDField[];
  columns: { key: string; label: string }[];
}

interface CRUDTabProps {
  entity: "skills" | "experiences" | "education" | "achievements" | "certifications" | "research" | "technical-events";
}

export default function CRUDTab({ entity }: CRUDTabProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Mappings per entity type
  const configs: Record<CRUDTabProps["entity"], CRUDConfig> = {
    skills: {
      entityName: "Skill",
      queryKey: "skills",
      getFn: portfolioApi.getSkills,
      createFn: portfolioApi.createSkill,
      updateFn: portfolioApi.updateSkill,
      deleteFn: portfolioApi.deleteSkill,
      fields: [
        { key: "name", label: "Skill Name", type: "text", required: true },
        { key: "level", label: "Proficiency Level (0-100)", type: "number", required: true },
        { key: "category", label: "Category", type: "select", options: ["Programming", "Web", "AI / ML", "Database", "Tools"], required: true },
      ],
      columns: [
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level (%)" },
      ],
    },
    experiences: {
      entityName: "Experience",
      queryKey: "experiences",
      getFn: portfolioApi.getExperiences,
      createFn: portfolioApi.createExperience,
      updateFn: portfolioApi.updateExperience,
      deleteFn: portfolioApi.deleteExperience,
      fields: [
        { key: "company", label: "Company", type: "text", required: true },
        { key: "role", label: "Role", type: "text", required: true },
        { key: "duration", label: "Duration", type: "text", required: true },
        { key: "description", label: "Job Description", type: "textarea", required: true },
        { key: "display_order", label: "Display Order", type: "number" },
      ],
      columns: [
        { key: "company", label: "Company" },
        { key: "role", label: "Role" },
        { key: "duration", label: "Duration" },
      ],
    },
    education: {
      entityName: "Education",
      queryKey: "education",
      getFn: portfolioApi.getEducation,
      createFn: portfolioApi.createEducation,
      updateFn: portfolioApi.updateEducation,
      deleteFn: portfolioApi.deleteEducation,
      fields: [
        { key: "institution", label: "Institution", type: "text", required: true },
        { key: "degree", label: "Degree / Program", type: "text", required: true },
        { key: "duration", label: "Duration", type: "text", required: true },
        { key: "description", label: "Details / GPA", type: "textarea" },
        { key: "display_order", label: "Display Order", type: "number" },
      ],
      columns: [
        { key: "institution", label: "Institution" },
        { key: "degree", label: "Degree" },
        { key: "duration", label: "Duration" },
      ],
    },
    achievements: {
      entityName: "Achievement",
      queryKey: "achievements",
      getFn: portfolioApi.getAchievements,
      createFn: portfolioApi.createAchievement,
      updateFn: portfolioApi.updateAchievement,
      deleteFn: portfolioApi.deleteAchievement,
      fields: [
        { key: "title", label: "Achievement Title", type: "text", required: true },
        { key: "description", label: "Details", type: "textarea", required: true },
        { key: "icon_name", label: "Lucide Icon (award/zap/book-open)", type: "text" },
        { key: "date", label: "Date / Year", type: "text" },
        { key: "display_order", label: "Display Order", type: "number" },
      ],
      columns: [
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
      ],
    },
    certifications: {
      entityName: "Certification",
      queryKey: "certifications",
      getFn: portfolioApi.getCertifications,
      createFn: portfolioApi.createCertification,
      updateFn: portfolioApi.updateCertification,
      deleteFn: portfolioApi.deleteCertification,
      fields: [
        { key: "title", label: "Credential Title", type: "text", required: true },
        { key: "issuer", label: "Issuer", type: "text", required: true },
        { key: "credential_url", label: "Verification Link", type: "text" },
        { key: "image_url", label: "Logo/Image Link", type: "text" },
        { key: "date", label: "Date / Year", type: "text" },
        { key: "display_order", label: "Display Order", type: "number" },
      ],
      columns: [
        { key: "title", label: "Title" },
        { key: "issuer", label: "Issuer" },
        { key: "date", label: "Date" },
      ],
    },
    research: {
      entityName: "Research Paper",
      queryKey: "research-papers",
      getFn: portfolioApi.getResearchPapers,
      createFn: portfolioApi.createResearchPaper,
      updateFn: portfolioApi.updateResearchPaper,
      deleteFn: portfolioApi.deleteResearchPaper,
      fields: [
        { key: "title", label: "Paper Title", type: "text", required: true },
        { key: "journal", label: "Journal / Venue", type: "text", required: true },
        { key: "doi", label: "DOI Link ID", type: "text" },
        { key: "publication_date", label: "Publication Date", type: "text", required: true },
        { key: "description", label: "Abstract/Details", type: "textarea" },
        { key: "url", label: "DOI Direct URL", type: "text" },
        { key: "badge", label: "Badge (e.g. IJISA 2024)", type: "text" },
      ],
      columns: [
        { key: "title", label: "Title" },
        { key: "journal", label: "Journal/Conference" },
        { key: "publication_date", label: "Date" },
      ],
    },
    "technical-events": {
      entityName: "Technical Event",
      queryKey: "technical-events",
      getFn: portfolioApi.getTechnicalEvents,
      createFn: portfolioApi.createTechnicalEvent,
      updateFn: portfolioApi.updateTechnicalEvent,
      deleteFn: portfolioApi.deleteTechnicalEvent,
      fields: [
        { key: "title", label: "Event Name", type: "text", required: true },
        { key: "date", label: "Date / Duration", type: "text", required: true },
        { key: "organizer", label: "Organizer", type: "text" },
        { key: "role", label: "Role (e.g., Participant, Speaker)", type: "text" },
        { key: "outcome", label: "Outcome / Details", type: "textarea" },
        { key: "display_order", label: "Display Order", type: "number" },
      ],
      columns: [
        { key: "title", label: "Event" },
        { key: "date", label: "Date" },
        { key: "role", label: "Role" },
      ],
    },
  };

  const cfg = configs[entity];

  // Fetch Items
  const { data: items, isLoading } = useQuery<any[]>({
    queryKey: [cfg.queryKey],
    queryFn: cfg.getFn,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: cfg.createFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cfg.queryKey] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => cfg.updateFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cfg.queryKey] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cfg.deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cfg.queryKey] });
      setDeleteConfirmId(null);
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    const initialForm: Record<string, any> = {};
    cfg.fields.forEach((f) => {
      initialForm[f.key] = f.type === "number" ? 0 : f.type === "select" && f.options ? f.options[0] : "";
    });
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    
    // Convert number inputs properly
    cfg.fields.forEach((f) => {
      if (f.type === "number") {
        dataToSave[f.key] = Number(dataToSave[f.key]);
      }
    });

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filter lists
  const filteredItems = items?.filter((item) => {
    const term = searchTerm.toLowerCase();
    const checkString = (item.name || item.company || item.institution || item.title || "").toLowerCase();
    return checkString.includes(term);
  }) || [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Manage {cfg.entityName} Records</h1>
          <p className="text-gray-400 text-xs">Full CRUD management of table configurations.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 cursor-pointer rounded-xl py-5 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      </div>

      {/* Filter / Search Row */}
      <div className="flex items-center bg-input border border-border rounded-xl px-3 py-1.5 max-w-sm">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter entries by title/name..."
          className="flex-1 bg-transparent text-white outline-none text-xs"
        />
      </div>

      {/* Table Data list */}
      <Card className="glass-panel border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 font-mono text-xs animate-pulse">
            Fetching system table datasets...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-gray-600" />
            <span>No records found in this table.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/45 border-b border-border/80 text-gray-400 uppercase tracking-widest text-[10px]">
                <tr>
                  {cfg.columns.map((col) => (
                    <th key={col.key} className="px-6 py-4">{col.label}</th>
                  ))}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                    {cfg.columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 max-w-[200px] truncate">{item[col.key]}</td>
                    ))}
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
                            onClick={() => handleDelete(item.id)}
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
          <Card className="max-w-md w-full glass-panel border-primary/30 rounded-2xl p-6 relative shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-secondary" />
                <h4 className="font-bold text-white font-display text-sm">
                  {editingItem ? "Edit" : "Create"} {cfg.entityName}
                </h4>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-400 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {cfg.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{f.label}</label>
                  
                  {f.type === "textarea" ? (
                    <textarea
                      value={formData[f.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.required}
                      rows={4}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 resize-none font-sans"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={formData[f.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 font-mono"
                    >
                      {f.options?.map((opt, oIdx) => (
                        <option key={oIdx} value={opt} className="bg-slate-950 text-white">{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ""}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.required}
                      className="w-full bg-input text-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 font-sans"
                    />
                  )}
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                Save Changes
              </Button>
            </form>

          </Card>
        </div>
      )}

    </div>
  );
}
