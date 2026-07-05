"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, Achievement } from "@/services/api";
import { Award, BookOpen, Zap, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";

// Removed defaultAchievements fallback. Data is exclusively loaded from API.

const ICON_CONFIGS: Record<
  string,
  { icon: React.ReactNode; color: string; glow: string }
> = {
  award: {
    icon: <Trophy className="w-7 h-7" />,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
  },
  "book-open": {
    icon: <BookOpen className="w-7 h-7" />,
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
  },
  zap: {
    icon: <Zap className="w-7 h-7" />,
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
  },
  default: {
    icon: <Star className="w-7 h-7" />,
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
  },
};

function AchievementCard({ ach }: { ach: Achievement }) {
  const cfg = ICON_CONFIGS[ach.icon_name ?? "default"] ?? ICON_CONFIGS.default;

  return (
    <motion.div variants={staggerItemVariants} className="h-full">
      <div
        className="glass-panel rounded-2xl p-6 flex flex-col h-full overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300"
        style={{
          border: `1px solid ${cfg.color}18`,
        }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />

        {/* Icon & date row */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={{
              background: `${cfg.color}12`,
              borderColor: `${cfg.color}25`,
              color: cfg.color,
              boxShadow: `0 0 20px ${cfg.glow}`,
            }}
          >
            {cfg.icon}
          </div>
          <span
            className="text-[10px] font-mono px-2.5 py-1 rounded-full border"
            style={{
              background: `${cfg.color}0a`,
              borderColor: `${cfg.color}20`,
              color: cfg.color,
            }}
          >
            {ach.date}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-end relative z-10">
          <h3 className="text-lg font-bold text-white font-display mb-2 tracking-wide group-hover:text-blue-200 transition-colors duration-300">
            {ach.title}
          </h3>
          <p className="text-slate-400 text-[13px] leading-relaxed">
            {ach.description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.color}40, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function AchievementsSection() {
  const { data: dbAchievements } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: portfolioApi.getAchievements,
  });

  const achievements = dbAchievements || [];



  return (
    <section id="achievements" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <Trophy className="w-3.5 h-3.5 text-pink-400" />
            Achievements
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-pink-500/30 to-transparent" />
        </motion.div>

        {achievements.length === 0 ? (
          <EmptyState icon={<Trophy />} message="Achievements are being compiled." />
        ) : (
          /* Grid */
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {achievements.map((achieve) => (
              <AchievementCard key={achieve.id} ach={achieve} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
