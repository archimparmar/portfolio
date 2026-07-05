"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Save, CheckCircle2, Sliders } from "lucide-react";

export default function SettingsTab() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({
    title: "",
    headline: "",
    about_description: "",
    resume_url: "",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch current site settings
  const { data: dbSettings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["site-settings"],
    queryFn: portfolioApi.getSiteSettings,
  });

  useEffect(() => {
    if (dbSettings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: dbSettings.title || "Archi Parmar Portfolio",
        headline: dbSettings.headline || "AI Engineer • Python Developer • Full Stack Developer",
        about_description: dbSettings.about_description || "",
        resume_url: dbSettings.resume_url || "",
      });
    }
  }, [dbSettings]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => portfolioApi.updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("idle");
    try {
      // Loop through keys and save
      for (const [key, value] of Object.entries(formData)) {
        await saveMutation.mutateAsync({ key, value });
      }
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-2xl font-bold text-white font-display">Site Configurations</h1>
        <p className="text-gray-400 text-xs">Manage public site headers, text details, and SEO parameters.</p>
      </div>

      <div className="max-w-xl">
        <Card className="glass-panel border-border p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6 font-semibold border-b border-border/50 pb-2 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-secondary" />
            Config Options
          </h4>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400 font-mono text-xs animate-pulse">
              Reading system configurations...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Site Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Metadata Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-input text-white border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50"
                  placeholder="e.g. Archi Parmar | Personal Portfolio"
                />
              </div>

              {/* Subtitle/Headline */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  required
                  className="w-full bg-input text-white border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50"
                  placeholder="e.g. AI Engineer • Python Developer"
                />
              </div>

              {/* Resume URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">PDF Resume Link (Relative /uploads/... URL)</label>
                <input
                  type="text"
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  className="w-full bg-input text-white border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50"
                  placeholder="e.g. /uploads/8b51d_resume.pdf"
                />
              </div>

              {/* About description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">About Me Bio</label>
                <textarea
                  value={formData.about_description}
                  onChange={(e) => setFormData({ ...formData, about_description: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-input text-white border border-border rounded-xl px-4 py-3 text-xs outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
                  placeholder="Describe your qualifications..."
                />
              </div>

              {/* Save Feedbacks */}
              {saveStatus === "success" && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-[10px] flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>SYSTEM_CONFIG: Settings synchronized successfully.</span>
                </div>
              )}

              {/* Save Button */}
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Syncing..." : "Save Settings"}
              </Button>

            </form>
          )}
        </Card>
      </div>

    </div>
  );
}
