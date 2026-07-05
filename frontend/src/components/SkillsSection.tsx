"use client";

import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, Skill } from "@/services/api";
import { motion, useInView } from "framer-motion";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { Cpu, Terminal, Database, Code, Sliders } from "lucide-react";

// Removed defaultSkills fallback. Data is exclusively loaded from API.

const CATEGORIES = [
  {
    name: "Programming",
    icon: <Code className="w-4 h-4" />,
    color: "#3b82f6",
    gradient: "from-blue-600/20 to-blue-500/5",
    border: "rgba(59,130,246,0.2)",
  },
  {
    name: "Web",
    icon: <Terminal className="w-4 h-4" />,
    color: "#10b981",
    gradient: "from-emerald-600/20 to-emerald-500/5",
    border: "rgba(16,185,129,0.2)",
  },
  {
    name: "AI / ML",
    icon: <Cpu className="w-4 h-4" />,
    color: "#06b6d4",
    gradient: "from-cyan-600/20 to-cyan-500/5",
    border: "rgba(6,182,212,0.2)",
  },
  {
    name: "Database",
    icon: <Database className="w-4 h-4" />,
    color: "#8b5cf6",
    gradient: "from-purple-600/20 to-purple-500/5",
    border: "rgba(139,92,246,0.2)",
  },
  {
    name: "Tools",
    icon: <Sliders className="w-4 h-4" />,
    color: "#f59e0b",
    gradient: "from-amber-600/20 to-amber-500/5",
    border: "rgba(245,158,11,0.2)",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated Skill Bar                                                   */
/* ------------------------------------------------------------------ */
function SkillBar({ skill, color, delay }: { skill: Skill; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-slate-300 font-medium">{skill.name}</span>
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color }}
        >
          {skill.level}%
        </span>
      </div>
      <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 6px ${color}80`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Card with 3D hover tilt                                    */
/* ------------------------------------------------------------------ */
function CategoryCard({
  category,
  skills,
  index,
}: {
  category: typeof CATEGORIES[0];
  skills: Skill[];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-cy * 7}deg) rotateY(${cx * 7}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <motion.div
      variants={staggerItemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease", transformStyle: "preserve-3d" }}
    >
      <div
        className="glass-panel p-6 rounded-2xl flex flex-col justify-start relative overflow-hidden h-full"
        style={{
          border: `1px solid ${category.border}`,
        }}
      >
        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${category.color}15 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Category header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `${category.color}18`,
              border: `1px solid ${category.color}30`,
              color: category.color,
            }}
          >
            {category.icon}
          </div>
          <h3 className="font-bold text-white font-display text-base tracking-wide">
            {category.name}
          </h3>
          <span
            className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: `${category.color}12`,
              color: category.color,
              border: `1px solid ${category.color}25`,
            }}
          >
            {skills.length}
          </span>
        </div>

        {/* Skills */}
        <div className="space-y-4 flex-1 relative z-10">
          {skills.map((skill, i) => (
            <SkillBar
              key={skill.id}
              skill={skill}
              color={category.color}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skills Section                                                       */
/* ------------------------------------------------------------------ */
export default function SkillsSection() {
  const { data: dbSkills } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: portfolioApi.getSkills,
  });

  const skills = dbSkills || [];

  const { ref: titleRef, controls: titleControls } = useScrollReveal();
  const { ref: gridRef, controls: gridControls } = useScrollReveal();

  return (
    <section id="skills" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(59,130,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <motion.div
          ref={titleRef}
          variants={fadeUpVariants}
          initial="hidden"
          animate={titleControls}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <Cpu className="w-3.5 h-3.5" />
            Skills Matrix
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={gridRef}
          variants={staggerContainerVariants}
          initial="hidden"
          animate={gridControls}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {CATEGORIES.map((cat, i) => {
            const catSkills = skills.filter(
              (s) =>
                s.category.toLowerCase().trim() ===
                cat.name.toLowerCase().trim()
            );
            if (catSkills.length === 0) return null;

            return (
              <CategoryCard
                key={cat.name}
                category={cat}
                skills={catSkills}
                index={i}
              />
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
