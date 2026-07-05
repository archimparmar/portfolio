"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Mail,
  ArrowRight,
  Download,
  Terminal,
  Brain,
  Cpu,
  ChevronDown,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Social icon SVGs                                                     */
/* ------------------------------------------------------------------ */
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

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Typing Effect Hook                                                   */
/* ------------------------------------------------------------------ */
import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/services/api";

function useTypingEffect(keywords: string[]) {
  const [typedText, setTypedText] = useState("");
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(100);

  useEffect(() => {
    const ticker = setInterval(() => {
      if (keywords.length === 0) return;
      const i = loopNum % keywords.length;
      const fullText = keywords[i];

      setTypedText((prev) => {
        if (!isDeleting) {
          const next = fullText.slice(0, prev.length + 1);
          if (next === fullText) {
            setIsDeleting(true);
            setDelta(2200);
          } else {
            setDelta(75);
          }
          return next;
        } else {
          const next = fullText.slice(0, prev.length - 1);
          if (next === "") {
            setIsDeleting(false);
            setLoopNum((n) => n + 1);
            setDelta(350);
          } else {
            setDelta(38);
          }
          return next;
        }
      });
    }, delta);

    return () => clearInterval(ticker);
  }, [loopNum, isDeleting, delta, keywords]);

  return typedText;
}

/* ------------------------------------------------------------------ */
/*  HeroSection                                                          */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const { data: settings } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: portfolioApi.getSiteSettings,
  });

  const { data: socialLinks } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: portfolioApi.getSocialLinks,
  });

  const headlineStr = settings?.headline || "Loading...";
  const keywords = headlineStr.split("•").map((s) => s.trim());
  const typedText = useTypingEffect(keywords);
  
  const title = settings?.title?.split("|")[0]?.trim() || "Archi Parmar";
  const resumeUrl = settings?.resume_url || "/resume.pdf";

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Parallax transforms
  const floatX = useTransform(springMouseX, [-0.5, 0.5], [-18, 18]);
  const floatY = useTransform(springMouseY, [-0.5, 0.5], [-12, 12]);
  const bgX = useTransform(springMouseX, [-0.5, 0.5], [-6, 6]);
  const bgY = useTransform(springMouseY, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();
      mouseX.set((clientX - left) / width - 0.5);
      mouseY.set((clientY - top) / height - 0.5);
    },
    [mouseX, mouseY]
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  /* -- Sequential animation variants --------------------------------- */
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 2.3, // wait for loader to disappear
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-20 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Radial hero spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Content grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 items-center relative z-10"
      >
        {/* ───── Left text column ───── */}
        <div className="md:col-span-7 flex flex-col items-start text-left">
          {/* System status badge */}
          <motion.div variants={item} className="mb-6">
            <div className="section-title-badge">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                style={{ animation: "loader-pulse-anim 2s ease-in-out infinite" }}
              />
              SYSTEM_STATUS: ONLINE
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-3 font-display text-gradient-hero leading-none"
          >
            {title}
          </motion.h1>

          {/* Sub-role */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl font-semibold text-slate-400 mb-5 tracking-wide"
          >
            {headlineStr}
          </motion.p>

          {/* Typing effect */}
          <motion.div
            variants={item}
            className="h-10 mb-8 font-mono text-cyan-400 text-lg sm:text-xl font-semibold flex items-center gap-1"
            aria-live="polite"
            aria-label={`Specializing in ${typedText}`}
          >
            <span className="text-slate-500 mr-1">&gt;</span>
            <span>{typedText}</span>
            <span
              className="w-2.5 h-6 bg-cyan-400 ml-0.5 rounded-sm"
              style={{
                boxShadow: "0 0 8px rgba(6,182,212,0.8)",
                animation: "loader-pulse-anim 1s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-3 w-full"
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-semibold hover:text-white hover:border-white/20 hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </button>

            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 text-sm font-semibold hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={item}
            className="flex items-center gap-5 mt-10"
          >
            {socialLinks?.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="w-10 h-10 rounded-xl border border-white/8 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                {social.icon_name === "github" ? <Github className="w-5 h-5" /> : 
                 social.icon_name === "linkedin" ? <Linkedin className="w-5 h-5" /> : 
                 <Mail className="w-5 h-5" />}
              </a>
            ))}
          </motion.div>
        </div>

        {/* ───── Right floating illustration ───── */}
        <div className="md:col-span-5 flex justify-center">
          <motion.div
            variants={item}
            style={{ x: floatX, y: floatY }}
            className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]"
          >
            {/* Ambient glow blobs */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 65%)",
                filter: "blur(30px)",
                animation: "loader-pulse-anim 4s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)",
                filter: "blur(50px)",
                animation:
                  "loader-pulse-anim 5s ease-in-out 1.5s infinite reverse",
              }}
            />

            {/* Outer rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                style={{ animation: "orbit-cw 50s linear infinite" }}
              >
                <defs>
                  <linearGradient
                    id="hero-ring-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#06b6d4"
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="50%"
                      stopColor="#3b82f6"
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.5"
                    />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#hero-ring-grad)"
                  strokeWidth="0.6"
                  strokeDasharray="6 4"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="68"
                  fill="none"
                  stroke="url(#hero-ring-grad)"
                  strokeWidth="1"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="46"
                  fill="none"
                  stroke="url(#hero-ring-grad)"
                  strokeWidth="0.6"
                  strokeDasharray="3 5"
                />
                {/* Orbiting nodes */}
                <circle cx="100" cy="10" r="3.5" fill="#06b6d4" />
                <circle cx="10" cy="100" r="2.5" fill="#3b82f6" />
                <circle cx="190" cy="100" r="2.5" fill="#8b5cf6" />
                <circle cx="100" cy="190" r="3" fill="#a78bfa" />
              </svg>
            </div>

            {/* Center brain core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="w-[130px] h-[130px] rounded-2xl glass-panel border-blue-500/20 flex items-center justify-center"
                style={{
                  boxShadow:
                    "0 0 50px rgba(59,130,246,0.35), 0 0 100px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <Cpu className="w-14 h-14 text-blue-400" style={{ filter: "drop-shadow(0 0 12px rgba(59,130,246,0.7))" }} />
              </motion.div>
            </div>

            {/* Floating skill badges */}
            <div
              className="absolute top-4 right-0 flex items-center gap-2 px-3 py-2 rounded-xl float-badge"
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(59,130,246,0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] font-bold font-mono text-slate-200">
                RAG Systems
              </span>
            </div>

            <div
              className="absolute bottom-8 left-0 flex items-center gap-2 px-3 py-2 rounded-xl float-badge-delayed"
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(139,92,246,0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
              <span className="text-[10px] font-bold font-mono text-slate-200">
                LLM Pipelines
              </span>
            </div>

            <div
              className="absolute top-1/2 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(6,182,212,0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(6,182,212,0.15)",
                animation: "float-y 5s ease-in-out 1s infinite",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span className="text-[10px] font-bold font-mono text-slate-200">
                FastAPI
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2"
        style={{
          animation: "scroll-bounce 2s ease-in-out infinite",
          transform: "translateX(-50%)",
        }}
        onClick={() => scrollToSection("about")}
        role="button"
        aria-label="Scroll to about section"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToSection("about")}
      >
        <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
          <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </motion.div>
    </section>
  );
}
