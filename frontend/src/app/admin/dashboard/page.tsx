"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Providers from "@/components/Providers";
import ParticleBackground from "@/components/ParticleBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import Sidebar Sub-Tabs
import OverviewTab from "./OverviewTab";
import ProjectsTab from "./ProjectsTab";
import BlogTab from "./BlogTab";
import InboxTab from "./InboxTab";
import MediaTab from "./MediaTab";
import SettingsTab from "./SettingsTab";
import CRUDTab from "./CRUDTab";

import {
  LayoutDashboard,
  Code,
  Sliders,
  Briefcase,
  GraduationCap,
  Cpu,
  BookOpen,
  Award,
  Star,
  FileText,
  Mail,
  LogOut,
  Terminal,
  Activity,
  Image,
  Calendar
} from "lucide-react";

type TabType =
  | "overview"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "research"
  | "certifications"
  | "achievements"
  | "technical-events"
  | "blog"
  | "messages"
  | "media"
  | "settings";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { isAuthenticated, isLoading, logout } = useAdminAuth(true);

  if (isLoading) {
    return (
      <div className="min-h-screen text-white bg-slate-950 flex items-center justify-center font-mono text-xs select-none">
        <div className="glass-panel border-primary/20 p-8 rounded-2xl flex flex-col items-center gap-3 animate-pulse shadow-lg">
          <Terminal className="w-8 h-8 text-secondary animate-spin" />
          <span>ESTABLISHING_SECURE_SESSION...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarLinks = [
    { id: "overview" as TabType, label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "projects" as TabType, label: "Projects", icon: <Code className="w-4 h-4" /> },
    { id: "skills" as TabType, label: "Skills", icon: <Cpu className="w-4 h-4" /> },
    { id: "experience" as TabType, label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education" as TabType, label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "research" as TabType, label: "Research", icon: <BookOpen className="w-4 h-4" /> },
    { id: "certifications" as TabType, label: "Certifications", icon: <Award className="w-4 h-4" /> },
    { id: "technical-events" as TabType, label: "Tech Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "achievements" as TabType, label: "Achievements", icon: <Star className="w-4 h-4" /> },
    { id: "blog" as TabType, label: "Blog CMS", icon: <FileText className="w-4 h-4" /> },
    { id: "messages" as TabType, label: "Contact Inbox", icon: <Mail className="w-4 h-4" /> },
    { id: "media" as TabType, label: "Media Library", icon: <Image className="w-4 h-4" /> },
    { id: "settings" as TabType, label: "Site Settings", icon: <Sliders className="w-4 h-4" /> },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "projects":
        return <ProjectsTab />;
      case "skills":
        return <CRUDTab entity="skills" />;
      case "experience":
        return <CRUDTab entity="experiences" />;
      case "education":
        return <CRUDTab entity="education" />;
      case "research":
        return <CRUDTab entity="research" />;
      case "certifications":
        return <CRUDTab entity="certifications" />;
      case "achievements":
        return <CRUDTab entity="achievements" />;
      case "technical-events":
        return <CRUDTab entity="technical-events" />;
      case "blog":
        return <BlogTab />;
      case "messages":
        return <InboxTab />;
      case "media":
        return <MediaTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Providers>
      <div className="relative min-h-screen text-foreground bg-slate-950 flex flex-col md:flex-row select-none">
        
        {/* Dynamic ambient effects */}
        <ParticleBackground />

        {/* Sidebar Container */}
        <aside className="w-full md:w-64 border-r border-border/80 bg-slate-950/60 backdrop-blur-xl shrink-0 flex flex-col justify-between relative z-20">
          <div>
            {/* Sidebar Brand header */}
            <div className="p-6 border-b border-border/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-xs tracking-wider font-display">ARCHI_PORTAL.OS</div>
                <div className="text-[9px] text-green-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  <span>SESSION_SECURE</span>
                </div>
              </div>
            </div>

            {/* Sidebar list items */}
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all select-none cursor-pointer ${
                    activeTab === link.id
                      ? "bg-primary text-white shadow-md shadow-primary/25 border border-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-muted/15 border border-transparent"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer (Logout action) */}
          <div className="p-4 border-t border-border/80 bg-slate-950/45">
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Terminate Session
            </Button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10 max-h-screen">
          {renderActiveTab()}
        </main>

      </div>
    </Providers>
  );
}
