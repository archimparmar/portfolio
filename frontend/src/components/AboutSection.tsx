"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain, Award, GraduationCap, Code2, Users2, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal, fadeUpVariants, fadeLeftVariants, fadeRightVariants, staggerContainerVariants, staggerItemVariants } from "@/hooks/useScrollReveal";
import { useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";

/* ------------------------------------------------------------------ */
/*  Animated number counter                                             */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  duration = 1600,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null!);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 40;
    const stepDuration = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                           */
/* ------------------------------------------------------------------ */
function StatCard({
  icon,
  label,
  meta,
  value,
  suffix = "",
  special,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  meta: string;
  value?: number;
  suffix?: string;
  special?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div variants={staggerItemVariants}>
      <Card className="glass-panel glass-panel-hover glowing-card p-6 flex flex-col justify-between border-border h-40 overflow-hidden relative group">
        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div className="flex items-center justify-between relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/8">
            {icon}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{meta}</span>
        </div>
        <div className="relative z-10">
          {special ? (
            <>
              {special}
              <div className="text-xs text-slate-500 font-mono">{label}</div>
            </>
          ) : (
            <>
              <div className="text-4xl font-extrabold text-white mb-0.5 font-display">
                {value !== undefined ? (
                  <AnimatedCounter target={value} suffix={suffix} />
                ) : null}
              </div>
              <div className="text-xs text-slate-500 font-mono">{label}</div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  About Section                                                       */
/* ------------------------------------------------------------------ */
export default function AboutSection() {
  const { ref: titleRef, controls: titleControls } = useScrollReveal();
  const { ref: leftRef, controls: leftControls } = useScrollReveal();
  const { ref: rightRef, controls: rightControls } = useScrollReveal();

  const { data: settings } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: portfolioApi.getSiteSettings,
  });

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: portfolioApi.getSkills,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: portfolioApi.getProjects,
  });

  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: portfolioApi.getExperiences,
  });

  const { data: research } = useQuery({
    queryKey: ["researchPapers"],
    queryFn: portfolioApi.getResearchPapers,
  });

  const techs = skills ? skills.map((s) => s.name) : [];
  const description = settings?.about_description || "";
  const projectsCount = projects?.length || 0;
  const experiencesCount = experiences?.length || 0;
  const researchCount = research?.length || 0;
  const techCount = skills?.length || 0;

  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Title */}
        <motion.div
          ref={titleRef}
          variants={fadeUpVariants}
          initial="hidden"
          animate={titleControls}
          className="flex items-center gap-4 mb-16"
        >
          <div className="section-title-badge">
            <GraduationCap className="w-3.5 h-3.5" />
            About Me
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-12 gap-14 items-start">

          {/* Left Column */}
          <motion.div
            ref={leftRef}
            variants={fadeLeftVariants}
            initial="hidden"
            animate={leftControls}
            className="md:col-span-7 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              <span className="text-gradient-blue">Engineering Intelligent</span>
              <br />
              <span className="text-white">Systems at Scale</span>
            </h2>

            <p className="text-slate-400 leading-relaxed text-[15px]">
              {description}
            </p>

            <div className="pt-4">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                Core Technology Focus
              </div>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Badge className="bg-blue-500/8 border border-blue-500/15 text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300 font-mono px-3 py-1.5 rounded-lg cursor-default transition-colors duration-200 text-xs">
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column – Stats Grid */}
          <motion.div
            ref={rightRef}
            variants={staggerContainerVariants}
            initial="hidden"
            animate={rightControls}
            className="md:col-span-5 grid grid-cols-2 gap-4"
          >
            <StatCard
              icon={<Code2 className="w-5 h-5 text-blue-400" />}
              meta="01 / PROJECTS"
              value={projectsCount}
              suffix="+"
              label="Projects Developed"
            />
            <StatCard
              icon={<Users2 className="w-5 h-5 text-cyan-400" />}
              meta="02 / WORK"
              value={experiencesCount}
              label="Completed Internships"
            />
            <StatCard
              icon={<Brain className="w-5 h-5 text-purple-400" />}
              meta="03 / ACADEMIC"
              value={researchCount}
              label="Research Publication"
            />
            <StatCard
              icon={<Award className="w-5 h-5 text-yellow-400" />}
              meta="04 / GATE"
              label="CS & IT Exam (2026)"
              special={
                <div className="text-xl font-bold text-white mb-0.5 font-display uppercase tracking-wide glow-text-blue">
                  QUALIFIED
                </div>
              }
            />

            {/* Wide stat */}
            <motion.div variants={staggerItemVariants} className="col-span-2">
              <Card className="glass-panel glass-panel-hover p-5 flex items-center justify-between border-border overflow-hidden h-20 relative group">
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(ellipse at right, rgba(6,182,212,0.05) 0%, transparent 70%)",
                  }}
                />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/8">
                    <Landmark className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Technologies Mastered</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Languages, libraries & design tools
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gradient-cyan font-display relative z-10">
                  <AnimatedCounter target={techCount} suffix="+" />
                </div>
              </Card>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
