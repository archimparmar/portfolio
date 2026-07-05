"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, Experience } from "@/services/api";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <motion.div variants={staggerItemVariants} className="relative pl-8 md:pl-0">
      <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
        {/* Timeline Marker (Mobile) */}
        <div className="absolute left-0 top-1.5 md:hidden w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10" />
        <div className="absolute left-[5px] top-4 bottom-[-32px] md:hidden w-px bg-gradient-to-b from-blue-500/50 to-transparent z-0" />

        {/* Date / Duration (Left column on Desktop) */}
        <div className="hidden md:block md:col-span-1 text-right mt-1">
          <span className="text-sm font-mono text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
            {experience.duration}
          </span>
        </div>

        {/* Desktop Timeline Marker */}
        <div className="hidden md:flex absolute left-[24.5%] top-0 bottom-[-32px] w-px bg-border/50 justify-center items-start pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] -ml-[4px]" />
        </div>

        {/* Content */}
        <div className="md:col-span-3 mb-8 md:mb-12">
          <div className="md:hidden mb-2">
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {experience.duration}
            </span>
          </div>
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-border/40 hover:border-blue-500/30 transition-colors duration-300 relative group overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at 100% 100%, rgba(59,130,246,0.05) 0%, transparent 50%)",
              }}
            />
            
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1 group-hover:text-blue-300 transition-colors">
              {experience.role}
            </h3>
            <div className="text-blue-400 font-medium mb-4">{experience.company}</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {experience.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { data: dbExperiences } = useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: portfolioApi.getExperiences,
  });

  const experiences = dbExperiences || [];


  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            Experience
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </motion.div>

        {experiences.length === 0 ? (
          <EmptyState icon={<Briefcase />} message="Career journey mapping in progress..." />
        ) : (
          /* List */
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="relative"
          >
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
