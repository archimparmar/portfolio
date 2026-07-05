"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Mail, Send, CheckCircle2, AlertTriangle, Terminal } from "lucide-react";
import { portfolioApi } from "@/services/api";
import { motion } from "framer-motion";
import {
  useScrollReveal,
  fadeUpVariants,
  fadeLeftVariants,
  fadeRightVariants,
} from "@/hooks/useScrollReveal";

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

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass =
  "w-full bg-white/3 text-white border border-white/8 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/5 placeholder:text-slate-600 font-sans";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { data: dbSocialLinks } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: portfolioApi.getSocialLinks,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await portfolioApi.submitContact(data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { ref: titleRef, controls: titleControls } = useScrollReveal();
  const { ref: leftRef, controls: leftControls } = useScrollReveal();
  const { ref: rightRef, controls: rightControls } = useScrollReveal();

  const getSocialIcon = (name?: string) => {
    if (name === "github") return <Github className="w-5 h-5" />;
    if (name === "linkedin") return <Linkedin className="w-5 h-5" />;
    return <Mail className="w-5 h-5" />;
  };

  const getSocialColor = (name?: string) => {
    if (name === "github") return "#94a3b8";
    if (name === "linkedin") return "#3b82f6";
    return "#06b6d4";
  };

  const contactLinks = dbSocialLinks?.map(link => ({
    icon: getSocialIcon(link.icon_name),
    label: link.name,
    value: link.url.replace(/^https?:\/\//, ""),
    href: link.url,
    color: getSocialColor(link.icon_name),
  })) || [];

  return (
    <section id="contact" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.05) 0%, transparent 70%)",
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
            <Terminal className="w-3.5 h-3.5" />
            Contact
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-12 gap-14 items-start">

          {/* Left – contact info */}
          <motion.div
            ref={leftRef}
            variants={fadeLeftVariants}
            initial="hidden"
            animate={leftControls}
            className="md:col-span-5 space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold font-display mb-3">
                <span className="text-white">Let&apos;s Build Something</span>
                <br />
                <span className="text-gradient-cyan">Together</span>
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                I&apos;m open to internship opportunities, research collaborations, open
                source contributions, or simply discussing AI and ML architecture. Use
                the contact form or any channel below to connect.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {contactLinks.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${info.color}30`;
                    el.style.background = `${info.color}06`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{
                      background: `${info.color}10`,
                      borderColor: `${info.color}25`,
                      color: info.color,
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">
                      {info.label}
                    </div>
                    <div
                      className="text-sm font-semibold text-slate-200 group-hover:transition-colors duration-200"
                      style={{}}
                    >
                      {info.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right – glassmorphism form */}
          <motion.div
            ref={rightRef}
            variants={fadeRightVariants}
            initial="hidden"
            animate={rightControls}
            className="md:col-span-7"
          >
            <div
              className="glass-panel rounded-2xl p-7 sm:p-10 relative overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-52 h-52 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-7 pb-4 border-b border-white/5 flex items-center gap-2 relative z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
                Secure Transmission Console
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    {...register("name")}
                    className={inputClass}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 font-mono">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register("email")}
                    className={inputClass}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 font-mono">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Message Payload
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    {...register("message")}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your project, offer, or questions..."
                  />
                  {errors.message && (
                    <span className="text-xs text-red-400 font-mono">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {/* Status messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl text-xs flex items-center gap-2 font-mono"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      color: "#34d399",
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    TRANSMISSION SUCCESSFUL: Message sent. Thank you!
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl text-xs flex items-center gap-2 font-mono"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#f87171",
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    TRANSMISSION FAILED: Server timeout. Please email directly.
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.2)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white loader-ring"
                      />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
