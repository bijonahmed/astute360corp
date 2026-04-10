// app/components/Loading.js
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loading({ duration = 2000 }) {
  const [dotCount, setDotCount] = useState(0);
  const [visible, setVisible] = useState(true);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide loader after duration
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 9999,
        opacity: 1,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Animated Logo */}
      <div style={{ marginBottom: "20px", animation: "bounce 1s infinite" }}>
        <Image
          src="/frontend_theme/images/logo.png"
          alt="logo"
          width={150}
          height={50}
        />
      </div>

      {/* Loading Text */}
      <h2 style={{ fontSize: "18px", color: "#333", fontWeight: 500 }}>
        Loading{".".repeat(dotCount)}
      </h2>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}