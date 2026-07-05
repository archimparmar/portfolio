"use client";

import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BookOpen, Calendar, ExternalLink, ShieldCheck, Zap, ArrowRight, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, ResearchPaper } from "@/services/api";
import { motion } from "framer-motion";
import { fadeUpVariants, fadeLeftVariants, fadeRightVariants } from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";

// Removed defaultPaper fallback to exclusively use backend data.

const hitlSteps = [
  {
    title: "Data Input",
    desc: "Unstructured business data enters the system (PDFs, invoices, emails).",
    icon: <BookOpen className="w-4 h-4" />,
    color: "#3b82f6",
  },
  {
    title: "RPA Execution",
    desc: "Algorithmic bots extract fields and run confidence validation metrics.",
    icon: <Zap className="w-4 h-4" />,
    color: "#f59e0b",
  },
  {
    title: "Triage & Check",
    desc: "Confidence check fails for complex anomalies, triggering routing rules.",
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "#ef4444",
  },
  {
    title: "Human Validation",
    desc: "Expert operators review exceptions, correcting and finalizing context inputs.",
    icon: <UserCheck className="w-4 h-4" />,
    color: "#10b981",
  },
];

export default function ResearchSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const { data: dbPapers } = useQuery<ResearchPaper[]>({
    queryKey: ["research-papers"],
    queryFn: portfolioApi.getResearchPapers,
  });

  const paper = dbPapers && dbPapers.length > 0 ? dbPapers[0] : null;



  return (
    <section id="research" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <BookOpen className="w-3.5 h-3.5" />
            Research
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </motion.div>

        {!paper ? (
          <EmptyState icon={<BookOpen />} message="No research published yet." />
        ) : (
          <div className="grid lg:grid-cols-12 gap-14 items-center">

            {/* Left – Paper Info */}
            <motion.div
              variants={fadeLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="lg:col-span-6 space-y-6"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa",
                }}
              >
                {paper.badge}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug font-display">
                {paper.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {paper.publication_date}
                </span>
                <span>•</span>
                <span className="text-slate-400 font-medium">{paper.journal}</span>
              </div>

              <p className="text-slate-400 leading-relaxed text-[14px]">
                {paper.description}
              </p>

              {paper.doi && (
                <div
                  className="p-4 rounded-xl font-mono text-xs"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-500 font-bold mb-1 text-[10px] tracking-widest uppercase">
                        DOI INDEX
                      </div>
                      <div className="text-cyan-400">{paper.doi}</div>
                    </div>
                    {paper.url && (
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        <button
                          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                          aria-label="Open paper"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right – HITL workflow accordion */}
            <motion.div
              variants={fadeRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="lg:col-span-6 flex flex-col items-center"
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                RPA & HITL Hybridized Workflow Architecture
              </div>

              <div className="w-full max-w-lg space-y-3">
                {hitlSteps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <motion.div
                      key={idx}
                      onClick={() => setActiveStep(isActive ? null : idx)}
                      initial={false}
                      animate={{
                        borderColor: isActive ? `${step.color}50` : "rgba(255,255,255,0.06)",
                        background: isActive ? `${step.color}0A` : "rgba(11,18,32,0.4)",
                      }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-4 p-4 rounded-xl border cursor-pointer group backdrop-blur-sm"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          background: isActive ? `${step.color}20` : "rgba(255,255,255,0.05)",
                          border: `1px solid ${isActive ? step.color + "40" : "rgba(255,255,255,0.08)"}`,
                          color: isActive ? step.color : "#64748b",
                        }}
                      >
                        {step.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-bold text-white font-display">
                            {step.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600">
                            STEP 0{idx + 1}
                          </span>
                        </div>
                        <motion.div
                          initial={false}
                          animate={{
                            height: isActive ? "auto" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                            {step.desc}
                          </p>
                        </motion.div>
                      </div>

                      <ArrowRight
                        className="w-4 h-4 text-slate-600 self-center shrink-0 transition-all duration-200"
                        style={{
                          transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                          color: isActive ? step.color : undefined,
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
}
