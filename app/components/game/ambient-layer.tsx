"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export function AmbientLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#0b0c10_10%,#14161d_45%,#0d0f13_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_38%,rgba(142,151,170,0.22),transparent_50%),radial-gradient(circle_at_70%_95%,rgba(89,96,110,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_88px)]" />
      <div className="absolute -left-44 top-24 h-96 w-96 rounded-full bg-slate-400/10 blur-[110px]" />
      <ParticleField />
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => {
        const seed = (index + 1) * 1.177;
        const frac = (value: number) => value - Math.floor(value);
        return {
          key: index,
          left: `${frac(seed * 7.12) * 100}%`,
          top: `${frac(seed * 4.83) * 100}%`,
          delay: frac(seed * 5.47) * 8,
          duration: 7 + frac(seed * 2.96) * 9,
          size: 1.5 + frac(seed * 9.31) * 3,
        };
      }),
    [],
  );

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.span
          key={particle.key}
          className="absolute rounded-full bg-white/28"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ y: [0, -10, 0], opacity: [0.08, 0.32, 0.1] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
