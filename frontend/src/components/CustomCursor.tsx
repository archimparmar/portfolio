"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rippleIdRef = useRef(0);

  // Raw cursor position
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Smoothly lagging ring
  const ringX = useSpring(cursorX, { damping: 32, stiffness: 350, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 32, stiffness: 350, mass: 0.5 });

  useEffect(() => {
    // Detect touch device — disable on touch
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive") ||
        target.getAttribute("role") === "button";
      setHovered(!!isInteractive);
    };

    const handleClick = (e: MouseEvent) => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);

      // Add ripple
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleHover, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY, visible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Ripple effects on click */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Lagging outer ring */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border"
          animate={{
            width: hovered ? 44 : clicked ? 20 : 32,
            height: hovered ? 44 : clicked ? 20 : 32,
            borderColor: hovered
              ? "rgba(139,92,246,0.8)"
              : "rgba(59,130,246,0.65)",
            backgroundColor: hovered
              ? "rgba(139,92,246,0.08)"
              : "rgba(59,130,246,0)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
      </motion.div>

      {/* Immediate inner dot */}
      {visible && (
        <motion.div
          className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            width: 6,
            height: 6,
            background: hovered ? "#a78bfa" : "#06b6d4",
            boxShadow: hovered
              ? "0 0 8px rgba(139,92,246,0.9)"
              : "0 0 8px rgba(6,182,212,0.9)",
          }}
          animate={{ scale: clicked ? 0.5 : hovered ? 1.5 : 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
        />
      )}
    </>
  );
}
