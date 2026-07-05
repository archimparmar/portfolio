"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number; // 200-280 blue/purple range
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleResize();

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const particleCount = prefersReducedMotion
      ? 0
      : window.innerWidth < 768
      ? 45
      : 80;

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 80 + 200, // 200–280: blue → purple
    }));

    const LINK_DIST = 100;
    const MOUSE_REPEL = 120;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_REPEL) {
          const force = ((MOUSE_REPEL - dist) / MOUSE_REPEL) * 0.8;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }

        // Velocity damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Clamp speed
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const ldist = Math.hypot(ldx, ldy);

          if (ldist < LINK_DIST) {
            const alpha = (1 - ldist / LINK_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 80%, 65%, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />

      {/* Aurora ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Primary aurora orb – top left */}
        <div
          className="absolute"
          style={{
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)",
            top: "-15%",
            left: "-10%",
            filter: "blur(60px)",
            animation: "aurora-float 22s ease-in-out infinite",
          }}
        />
        {/* Secondary aurora orb – bottom right */}
        <div
          className="absolute"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)",
            bottom: "-10%",
            right: "-5%",
            filter: "blur(80px)",
            animation: "aurora-float 28s ease-in-out 5s infinite reverse",
          }}
        />
        {/* Tertiary aurora orb – center */}
        <div
          className="absolute"
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(100px)",
            animation: "aurora-float 18s ease-in-out 10s infinite",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 grid-overlay"
          style={{ opacity: 0.4 }}
        />
      </div>
    </>
  );
}
