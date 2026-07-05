"use client";

import React, { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, Project } from "@/services/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Sparkles, FolderDot, ArrowRight, AlertTriangle } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);



// Removed defaultProjects fallback. Data is exclusively loaded from API.

/* ------------------------------------------------------------------ */
/*  Project Card                                                         */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-cy * 4}deg) rotateY(${cx * 4}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };

  // Defensive fallbacks
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const features = Array.isArray(project.features) ? project.features : [];

  return (
    <motion.div
      variants={staggerItemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl group overflow-hidden"
      style={{
        transition: "transform 0.15s ease",
        transformStyle: "preserve-3d",
        // Featured gets gradient border treatment
        background: project.is_featured
          ? "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.04))"
          : undefined,
      }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: project.is_featured
            ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1), rgba(6,182,212,0.15))"
            : "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
          zIndex: -1,
          inset: -1,
        }}
      />

      {/* Card body */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 overflow-hidden">


        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-start h-full">
            <h3 className="text-2xl font-bold text-white mb-3 font-display group-hover:text-blue-300 transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-slate-400 mb-5 leading-relaxed text-sm">
              {project.description}
            </p>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-5">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                  Key Capabilities
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-400"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #3b82f6, #06b6d4)",
                          boxShadow: "0 0 4px rgba(59,130,246,0.6)",
                        }}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech stack */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      color: "#94a3b8",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-3 mt-auto">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200">
                    <Github className="w-3.5 h-3.5" />
                    Source Code
                  </button>
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects Section                                                     */
/* ------------------------------------------------------------------ */
export default function ProjectsSection() {
  const { data: dbProjects, isError, error, isFetching } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: portfolioApi.getProjects,
  });

  const projects = Array.isArray(dbProjects) ? dbProjects : [];

  // Development debugging logs removed to prevent console spam

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const headerControls = useAnimation();

  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });
  const gridControls = useAnimation();

  useEffect(() => {
    if (isHeaderInView) headerControls.start("visible");
  }, [isHeaderInView, headerControls]);

  useEffect(() => {
    if (isGridInView) gridControls.start("visible");
  }, [isGridInView, gridControls]);

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      {/* Decorative background element */}
      <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          ref={headerRef}
          variants={fadeUpVariants}
          initial="hidden"
          animate={headerControls}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-medium mb-6">
            <FolderDot className="w-4 h-4" />
            <span>02. Architecture & Implementations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight leading-tight">
            Featured <span className="text-blue-500">Projects</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            A curated selection of my most impactful engineering work, spanning AI applications, virtual reality, and scalable backend systems.
          </p>
        </motion.div>

        {isError && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-sm font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Failed to fetch projects</p>
              <p className="opacity-80 mt-1">{error?.message || "Unknown error occurred"}</p>
            </div>
          </div>
        )}

        <ErrorBoundary sectionName="Projects Grid">
          <motion.div
            ref={gridRef}
            variants={staggerContainerVariants}
            initial="hidden"
            animate={gridControls}
            className="grid gap-8"
          >
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <ErrorBoundary key={project.id || i} sectionName={`ProjectCard-${project.title}`}>
                  <ProjectCard project={project} index={i} />
                </ErrorBoundary>
              ))
            ) : !isFetching && !isError ? (
              <div className="col-span-full py-12 flex items-center justify-center border border-dashed border-slate-700/50 rounded-2xl">
                <p className="text-slate-500 font-mono text-sm">No projects currently available.</p>
              </div>
            ) : null}
          </motion.div>
        </ErrorBoundary>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/archimparmar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 font-mono text-sm transition-colors group"
          >
            View more on GitHub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
