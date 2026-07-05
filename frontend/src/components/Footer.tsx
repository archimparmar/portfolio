"use client";

import React from "react";
import { Brain, Heart, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navSections = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Research", id: "research" },
  { label: "Certifications", id: "certifications" },
  { label: "Technical Events", id: "technical-events" },
  { label: "Achievements", id: "achievements" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const { data: dbSocialLinks } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: portfolioApi.getSocialLinks,
  });

  const getSocialIcon = (name?: string) => {
    if (name === "github") return <Github className="w-4 h-4" />;
    if (name === "linkedin") return <Linkedin className="w-4 h-4" />;
    return <Brain className="w-4 h-4" />;
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-8 overflow-hidden">
      {/* Top gradient divider */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)",
        }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(59,130,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
        <div className="grid md:grid-cols-12 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold tracking-[0.12em] font-display text-sm">
                  ARCHI_PORTFOLIO
                </div>
                <div className="text-[10px] text-cyan-400 font-mono tracking-widest">
                  AI ENGINEER
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              &quot;Building intelligent solutions that solve real-world problems through the intersection of AI and thoughtful engineering.&quot;
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {dbSocialLinks?.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200"
                >
                  {getSocialIcon(s.icon_name)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navSections.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 py-1"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* System info */}
          <div className="md:col-span-3">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
              System Info
            </div>
            <div className="space-y-2">
              {[
                { label: "Stack", value: "Next.js 16 + FastAPI" },
                { label: "Runtime", value: "Python 3.13.0" },
                { label: "Database", value: "PostgreSQL" },
                { label: "Deploy", value: "Vercel + Railway" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-600">{item.label}</span>
                  <span className="text-[11px] font-mono text-slate-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[11px] font-mono text-slate-600" suppressHydrationWarning>
            © {new Date().getFullYear()} Archi Parmar. All rights reserved.
          </p>

          <p className="text-[11px] font-mono text-slate-600 flex items-center gap-1.5">
            Crafted with{" "}
            <Heart className="w-3 h-3 text-red-500" fill="currentColor" />{" "}
            using Next.js & FastAPI
          </p>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
