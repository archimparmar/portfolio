"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, TechnicalEvent } from "@/services/api";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";

function TechnicalEventCard({ event }: { event: TechnicalEvent }) {
  return (
    <motion.div variants={staggerItemVariants}>
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-border/40 hover:border-violet-500/30 transition-colors duration-300 relative group overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, rgba(139,92,246,0.05) 0%, transparent 50%)",
          }}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display group-hover:text-violet-300 transition-colors">
            {event.title}
          </h3>
          {event.date && (
            <span className="shrink-0 text-[11px] font-mono text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 sm:mt-1">
              {event.date}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
          {event.role && (
            <div className="text-violet-400 font-medium">{event.role}</div>
          )}
          {event.role && event.organizer && (
            <div className="hidden sm:block text-slate-500">•</div>
          )}
          {event.organizer && (
            <div className="text-slate-300 font-medium">{event.organizer}</div>
          )}
        </div>

        {event.outcome && (
          <p className="text-slate-400 text-sm leading-relaxed">
            {event.outcome}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function TechnicalEventsSection() {
  const { data: dbEvents } = useQuery<TechnicalEvent[]>({
    queryKey: ["technical-events"],
    queryFn: portfolioApi.getTechnicalEvents,
  });

  const events = dbEvents || [];



  return (
    <section id="technical-events" className="py-24 px-6 relative">
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
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            Technical Events
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent" />
        </motion.div>

        {events.length === 0 ? (
          <EmptyState icon={<Calendar />} message="No technical events attended yet." />
        ) : (
          /* Grid */
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((ev) => (
              <TechnicalEventCard key={ev.id} event={ev} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
