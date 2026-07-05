"use client";

import React from "react";
import { Brain, Cpu, Code, Database, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface TechNode {
  name: string;
  icon: React.ReactNode;
  orbitIndex: number;
  angleOffset: number;
  color: string;
}

const techs: TechNode[] = [
  // Inner Orbit
  { name: "Git", icon: <Code className="w-3.5 h-3.5" />, orbitIndex: 0, angleOffset: 0, color: "#f97316" },
  { name: "HTML", icon: <Code className="w-3.5 h-3.5" />, orbitIndex: 0, angleOffset: 120, color: "#ef4444" },
  { name: "CSS", icon: <Code className="w-3.5 h-3.5" />, orbitIndex: 0, angleOffset: 240, color: "#3b82f6" },

  // Middle Orbit
  { name: "Gemini AI", icon: <Sparkles className="w-3.5 h-3.5" />, orbitIndex: 1, angleOffset: 0, color: "#06b6d4" },
  { name: "Java", icon: <Code className="w-3.5 h-3.5" />, orbitIndex: 1, angleOffset: 90, color: "#ef4444" },
  { name: "SQL", icon: <Database className="w-3.5 h-3.5" />, orbitIndex: 1, angleOffset: 180, color: "#8b5cf6" },
  { name: "Power BI", icon: <Terminal className="w-3.5 h-3.5" />, orbitIndex: 1, angleOffset: 270, color: "#f59e0b" },

  // Outer Orbit
  { name: "Python", icon: <Cpu className="w-3.5 h-3.5" />, orbitIndex: 2, angleOffset: 45, color: "#60a5fa" },
  { name: "Django", icon: <Terminal className="w-3.5 h-3.5" />, orbitIndex: 2, angleOffset: 135, color: "#10b981" },
  { name: "FastAPI", icon: <Terminal className="w-3.5 h-3.5" />, orbitIndex: 2, angleOffset: 225, color: "#06b6d4" },
  { name: "LangChain", icon: <Brain className="w-3.5 h-3.5" />, orbitIndex: 2, angleOffset: 315, color: "#34d399" },
];

const ORBIT_RADII = [90, 155, 220];
const ORBIT_DURATIONS = [20, 30, 42];

export default function OrbitVisualization() {
  return (
    <div
      className="relative flex items-center justify-center w-full select-none rounded-3xl overflow-hidden"
      style={{
        height: 500,
        background: "rgba(11,18,32,0.4)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 200px at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Orbit rings */}
      {ORBIT_RADII.map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: r * 2,
            height: r * 2,
            border: "1px solid rgba(59,130,246,0.1)",
            boxShadow: "inset 0 0 30px rgba(59,130,246,0.02)",
          }}
        />
      ))}

      {/* Central core */}
      <motion.div
        className="absolute z-20 flex flex-col items-center justify-center text-center"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))",
          border: "1px solid rgba(59,130,246,0.4)",
          boxShadow:
            "0 0 40px rgba(59,130,246,0.4), 0 0 80px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
          backdropFilter: "blur(16px)",
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <Brain
          className="w-8 h-8 mb-1 text-blue-300"
          style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.8))" }}
        />
        <span className="text-[9px] font-bold text-blue-200 tracking-widest font-mono leading-tight px-2">
          AI
          <br />
          CORE
        </span>
      </motion.div>

      {/* Orbiting tech nodes */}
      {techs.map((tech, i) => {
        const r = ORBIT_RADII[tech.orbitIndex];
        const dur = ORBIT_DURATIONS[tech.orbitIndex];

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: 0,
              height: 0,
              top: "50%",
              left: "50%",
              animation: `orbit-rotate-${tech.orbitIndex} ${dur}s linear infinite`,
              animationDelay: `${tech.angleOffset / 360 * -dur}s`,
            }}
          >
            <div
              className="absolute rounded-full flex items-center justify-center"
              style={{
                // Position: go out by radius then back-center the pill
                transform: `translate(${r - 16}px, -50%)`,
              }}
            >
              {/* Tech pill */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full whitespace-nowrap"
                style={{
                  background: `${tech.color}14`,
                  border: `1px solid ${tech.color}30`,
                  backdropFilter: "blur(8px)",
                  color: tech.color,
                  boxShadow: `0 2px 12px ${tech.color}20`,
                  fontSize: "10px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                }}
              >
                {tech.icon}
                <span className="text-white/80">{tech.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
