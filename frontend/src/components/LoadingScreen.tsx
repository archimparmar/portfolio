"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  const phases = [
    "Initializing system...",
    "Loading neural modules...",
    "Calibrating AI pipeline...",
    "Rendering interface...",
    "System online.",
  ];

  useEffect(() => {
    // Simulate realistic loading progress
    const intervals: ReturnType<typeof setTimeout>[] = [];

    const steps = [
      { target: 20, delay: 0, duration: 300 },
      { target: 45, delay: 320, duration: 400 },
      { target: 68, delay: 740, duration: 350 },
      { target: 88, delay: 1100, duration: 400 },
      { target: 100, delay: 1520, duration: 300 },
    ];

    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setProgress(step.target);
        setPhase(i);
      }, step.delay);
      intervals.push(t);
    });

    const finishTimer = setTimeout(() => {
      setDone(true);
    }, 2100);
    intervals.push(finishTimer);

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "#050816" }}
        >
          {/* Background aurora orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                top: "10%",
                left: "20%",
                transform: "translate(-50%, -50%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                bottom: "20%",
                right: "20%",
                filter: "blur(60px)",
              }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-10 z-10">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Spinning outer rings */}
              <div
                className="absolute inset-0 rounded-full border border-blue-500/20 loader-ring"
                style={{ width: 100, height: 100, margin: -10 }}
              />
              <div
                className="absolute inset-0 rounded-full border border-purple-500/15 loader-ring"
                style={{ width: 120, height: 120, margin: -20, animationDuration: "1.8s", animationDirection: "reverse" }}
              />

              {/* Core icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                <Brain className="w-10 h-10 text-white loader-pulse" />
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-white font-bold text-2xl tracking-[0.2em] font-display">
                ARCHI_PORTFOLIO
              </div>
              <div className="text-blue-400/70 font-mono text-xs tracking-[0.3em] mt-1">
                AI ENGINEER
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-64 flex flex-col gap-3"
            >
              {/* Bar track */}
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.8)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Phase text */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-blue-400/80">
                  {phases[phase]}
                </span>
                <span className="font-mono text-[11px] text-white/40">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
