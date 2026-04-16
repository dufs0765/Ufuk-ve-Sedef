"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { assetUrl } from "@/app/lib/asset-path";

type SubtleHeartRainProps = {
  count?: number;
  mode?: "mixed" | "orange" | "olive";
  oliveTone?: "mixed" | "green";
};

export function SubtleHeartRain({
  count = 7,
  mode = "mixed",
  oliveTone = "mixed",
}: SubtleHeartRainProps) {
  const olives = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const seed = (index + 1) * 1.237;
        const frac = (value: number) => value - Math.floor(value);
        const pick = frac(seed * 7.97);
        const kind: "orange" | "olive-green" | "olive-black" =
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
          id: index,
          left: `${frac(seed * 6.37) * 100}%`,
          duration: 12 + frac(seed * 3.91) * 10,
          delay: frac(seed * 7.11) * 6,
          width: 14 + frac(seed * 8.41) * 10,
          height: 14 + frac(seed * 5.91) * 10,
          drift: (frac(seed * 9.23) - 0.5) * 30,
          kind,
        };
      }),
    [count, mode, oliveTone],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
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
          className="absolute top-[-8%] select-none opacity-60"
          style={{
            left: olive.left,
            width: olive.width,
            height: olive.height,
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.22))",
          }}
          animate={{ y: ["0vh", "115vh"], x: [0, olive.drift, 0], opacity: [0, 0.4, 0.2, 0] }}
          transition={{
            duration: olive.duration,
            delay: olive.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
