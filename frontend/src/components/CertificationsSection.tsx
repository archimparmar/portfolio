"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioApi, Certification } from "@/services/api";
import { Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/hooks/useScrollReveal";
import { EmptyState } from "./EmptyState";

function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <motion.div variants={staggerItemVariants} className="h-full">
      <div
        className="glass-panel rounded-2xl p-6 flex flex-col h-full overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300"
        style={{ border: `1px solid rgba(236, 72, 153, 0.15)` }} // Pink-500 accent
      >
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-pink-500/10 border-pink-500/20 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <Award className="w-6 h-6" />
          </div>
          {cert.date && (
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border bg-pink-500/5 border-pink-500/20 text-pink-400">
              {cert.date}
            </span>
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col justify-end relative z-10 mb-4">
          <h3 className="text-lg font-bold text-white font-display mb-2 tracking-wide group-hover:text-pink-300 transition-colors duration-300">
            {cert.title}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            {cert.issuer}
          </p>
        </div>

        {/* External Link */}
        {cert.credential_url && (
          <div className="relative z-10 mt-auto pt-4 border-t border-border/50">
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors"
            >
              View Credential <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        )}

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(236,72,153,0.4), transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const { data: dbCertifications } = useQuery<Certification[]>({
    queryKey: ["certifications"],
    queryFn: portfolioApi.getCertifications,
  });

  const certifications = dbCertifications || [];

  return (
    <section id="certifications" className="py-24 px-6 relative">
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
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            Certifications
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent" />
        </motion.div>

        {certifications.length === 0 ? (
          <EmptyState icon={<Award />} message="Certifications will appear here." />
        ) : (
          /* Grid */
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => (
              <CertificationCard key={cert.id} cert={cert} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
