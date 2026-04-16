"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { assetUrl } from "@/app/lib/asset-path";

interface Olive {
  id: number;
  x: number;
  delay: number;
  size: number;
  height: number;
  duration: number;
  kind: "orange" | "olive-green" | "olive-black";
}

type FruitRainProps = {
  count?: number;
  mode?: "mixed" | "orange" | "olive";
  oliveTone?: "mixed" | "green";
  /** false = bir kez düşer, sürekli tekrar etmez (performans) */
  loop?: boolean;
};

export default function FruitRain({ count = 35, mode = "mixed", oliveTone = "mixed", loop = true }: FruitRainProps) {
  const olives: Olive[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = i * 1.61803398875;
        const frac = (value: number) => value - Math.floor(value);
        const pick = frac(seed * 6.31);
        const kind: Olive["kind"] =
          mode === "orange"
            ? "orange"
            : mode === "olive"
              ? (oliveTone === "green" || pick > 0.5 ? "olive-green" : "olive-black")
              : pick > 0.62
                ? "orange"
                : oliveTone === "green" || pick > 0.31
                  ? "olive-green"
                  : "olive-black";

        return {
          id: i,
          x: frac(seed * 7.13) * 100,
          delay: frac(seed * 3.41) * 4,
          size: frac(seed * 4.71) * 20 + 22,
          height: frac(seed * 5.87) * 20 + 22,
          duration: frac(seed * 11.42) * 3.5 + 2.5,
          kind,
        };
      }),
    [count, mode, oliveTone],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {olives.map((olive) => (
        <motion.img
          key={olive.id}
          src={assetUrl(
            olive.kind === "orange"
              ? "/icons/menu-fruit.svg"
              : olive.kind === "olive-green"
                ? "/icons/olive-green.svg"
                : "/icons/olive-black.svg",
          )}
          alt="meyve"
          className="absolute top-[-40px] select-none"
          style={{
            left: `${olive.x}%`,
            width: olive.size,
            height: olive.height,
            filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.35))",
          }}
          animate={{ y: "115vh", rotate: [0, 20, -20, 10, 0], opacity: [1, 1, 0.7] }}
          transition={{
            duration: olive.duration,
            delay: olive.delay,
            repeat: loop ? Infinity : 0,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
