"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";
import { Code, Cpu, BookOpen, MessageSquare, Award, Star, Activity, Sparkles } from "lucide-react";

export default function OverviewTab() {
  // Query totals
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: portfolioApi.getProjects });
  const { data: skills } = useQuery({ queryKey: ["skills"], queryFn: portfolioApi.getSkills });
  const { data: experiences } = useQuery({ queryKey: ["experiences"], queryFn: portfolioApi.getExperiences });
  const { data: education } = useQuery({ queryKey: ["education"], queryFn: portfolioApi.getEducation });
  const { data: certs } = useQuery({ queryKey: ["certifications"], queryFn: portfolioApi.getCertifications });
  const { data: papers } = useQuery({ queryKey: ["research-papers"], queryFn: portfolioApi.getResearchPapers });
  const { data: achievements } = useQuery({ queryKey: ["achievements"], queryFn: portfolioApi.getAchievements });
  const { data: posts } = useQuery({ queryKey: ["blog-posts"], queryFn: portfolioApi.getBlogPosts });
  const { data: messages } = useQuery({ queryKey: ["messages"], queryFn: portfolioApi.getMessages });

  const metrics = [
    { label: "Total Projects", value: projects?.length || 0, icon: <Code className="w-5 h-5 text-primary" /> },
    { label: "Skills Matrix", value: skills?.length || 0, icon: <Cpu className="w-5 h-5 text-secondary" /> },
    { label: "Research Papers", value: papers?.length || 0, icon: <BookOpen className="w-5 h-5 text-purple-400" /> },
    { label: "Blog Posts", value: posts?.length || 0, icon: <Sparkles className="w-5 h-5 text-pink-400" /> },
    { label: "Certifications", value: certs?.length || 0, icon: <Award className="w-5 h-5 text-yellow-400" /> },
    { label: "Contact Inbox", value: messages?.length || 0, icon: <MessageSquare className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome banner */}
      <div className="flex items-center justify-between border-b border-border/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">System Analytics</h1>
          <p className="text-gray-400 text-sm">Real-time database metrics dashboard overview.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-full">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>PORTFOLIO_NODE: ACTIVE</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="glass-panel border-border/80 p-5 flex flex-col justify-between h-32 select-none hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              {m.icon}
              <span className="text-[10px] font-mono text-gray-500">0{i+1}</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white font-display">{m.value}</div>
              <div className="text-[11px] text-gray-400 font-medium">{m.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytical Charts using Custom SVGs */}
      <div className="grid md:grid-cols-12 gap-6 pt-4">
        
        {/* Chart 1 - Traffic analytics */}
        <Card className="md:col-span-8 glass-panel border-border/80 p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Visitor Ingress Log</h3>
            <p className="text-xs text-gray-400">Aggregated system requests by month (simulated).</p>
          </div>
          
          <div className="relative w-full h-[240px] border-b border-l border-border/50 flex items-end">
            
            {/* Custom SVG Line Chart */}
            <svg viewBox="0 0 500 200" className="w-full h-full text-primary absolute inset-0 overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Gridlines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* Area path */}
              <path
                d="M 0 170 C 50 140, 100 160, 150 90 C 200 40, 250 80, 300 110 C 350 130, 400 60, 500 30 L 500 200 L 0 200 Z"
                fill="url(#chart-grad)"
              />
              
              {/* Line path */}
              <path
                d="M 0 170 C 50 140, 100 160, 150 90 C 200 40, 250 80, 300 110 C 350 130, 400 60, 500 30"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2.5"
              />

              {/* Pulsing nodes */}
              <circle cx="150" cy="90" r="4.5" fill="#00E5FF" className="animate-pulse" />
              <circle cx="500" cy="30" r="4.5" fill="#00E5FF" className="animate-pulse" />
            </svg>
            
            {/* Axis labels */}
            <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[9px] font-mono text-gray-500 px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </Card>

        {/* Chart 2 - Message inbox summary */}
        <Card className="md:col-span-4 glass-panel border-border/80 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Active Inquiries</h3>
            <p className="text-xs text-gray-400">Breakdown of recent inbox payloads.</p>
          </div>

          <div className="space-y-4 my-6">
            <div className="flex justify-between items-center text-xs font-mono text-gray-300">
              <span>Unread</span>
              <span className="text-secondary">{messages?.filter(m=>!m.is_read).length || 0} messages</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden flex">
              <div 
                className="bg-secondary h-full" 
                style={{ width: `${((messages?.filter(m=>!m.is_read).length || 0) / (messages?.length || 1)) * 100}%` }} 
              />
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
              Immediate action is recommended on pending unread recruitment entries.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border/40">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-300 font-mono">System Integrity: 100% SECURE</span>
          </div>
        </Card>

      </div>

    </div>
  );
}
