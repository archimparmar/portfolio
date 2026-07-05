import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel p-8 rounded-2xl flex flex-col items-center max-w-sm w-full border-white/5 bg-slate-900/20 shadow-lg"
      >
        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4 border border-white/5 shadow-inner">
          {icon}
        </div>
        <p className="text-sm text-slate-400 font-medium text-center font-mono">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
