"use client";

import React from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ResearchSection from "@/components/ResearchSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import TechnicalEventsSection from "@/components/TechnicalEventsSection";
import OrbitVisualization from "@/components/OrbitVisualization";
import AchievementsSection from "@/components/AchievementsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingAssistant from "@/components/FloatingAssistant";
import LoadingScreen from "@/components/LoadingScreen";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden font-sans">

      {/* Premium Loading Sequence */}
      <LoadingScreen />

      {/* Persistent Background Layers (z-0 / z-1) */}
      <ParticleBackground />

      {/* Overlay UI */}
      <FloatingAssistant />

      {/* Main Application Shell */}
      <div className="relative z-10 w-full">
        <Navigation />

        <main className="w-full" id="main-content">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ResearchSection />
          <ExperienceSection />
          <EducationSection />
          <CertificationsSection />
          <TechnicalEventsSection />

          {/* Tech Orbit Visualization */}
          <section className="py-28 px-6 relative max-w-7xl mx-auto" aria-label="Tech Orbit visualization">
            <motion.div
              initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-16">
                <div className="section-title-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                  Tech Orbit
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
              </div>

              <div className="grid md:grid-cols-12 gap-10 items-center">
                <div className="md:col-span-4 space-y-4">
                  <h3 className="text-2xl font-bold text-white font-display">
                    Dynamic Ecosystem
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Visual representation of the relationships between core AI paradigms (center core)
                    and secondary development frameworks, orbiting continuously by execution weight.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      style={{ animation: "loader-pulse-anim 2s ease-in-out infinite", boxShadow: "0 0 6px rgba(6,182,212,0.8)" }}
                    />
                    Rotating relative to execution weight
                  </div>
                </div>
                <div className="md:col-span-8 flex justify-center">
                  <OrbitVisualization />
                </div>
              </div>
            </motion.div>
          </section>

          <AchievementsSection />
          <BlogSection />
          <ContactSection />
        </main>

        <Footer />
      </div>

    </div>
  );
}
