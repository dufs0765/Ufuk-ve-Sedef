"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type DodgeNoButtonProps = {
  yesButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  dodgeBeforeClick?: number;
};

export function DodgeNoButton({ yesButtonRef, onClick, dodgeBeforeClick = 1 }: DodgeNoButtonProps) {
  const BUTTON_WIDTH = 152;
  const [position, setPosition] = useState<{ x: number; y: number; rotate: number }>({
    x: 0,
    y: 0,
    rotate: 0,
  });
  const clickCountRef = useRef(0);
  const seedRef = useRef(2);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const placeInitial = () => {
      setPosition({ x: 0, y: 0, rotate: 0 });
    };
    placeInitial();
    window.addEventListener("resize", placeInitial);
    return () => window.removeEventListener("resize", placeInitial);
  }, [yesButtonRef]);

  useEffect(() => {
    clickCountRef.current = 0;
  }, [dodgeBeforeClick]);

  const computeNextPosition = () => {
    const wrapRect = wrapperRef.current?.getBoundingClientRect();
    if (!wrapRect) return { x: 0, y: 0, rotate: 0 };
    const maxX = Math.max(0, wrapRect.width - BUTTON_WIDTH - 8);
    const maxY = 24;

    seedRef.current += 1;
    const frac = (value: number) => value - Math.floor(value);
    const seed = seedRef.current * 1.618;
    let x = -maxX / 2 + frac(seed * 9.41) * maxX;
    const minDistance = maxX * 0.25;
    if (Math.abs(x) < minDistance) {
      x = x < 0 ? -minDistance : minDistance;
    }
    const y = frac(seed * 6.11) * maxY;
    const rotate = (seedRef.current % 2 === 0 ? -1 : 1) * (6 + frac(seed * 4.27) * 7);
    return { x, y, rotate };
  };

  const handleNoClick = () => {
    if (clickCountRef.current < dodgeBeforeClick) {
      clickCountRef.current += 1;
      setPosition(computeNextPosition());
      return;
    }
    onClick();
  };

  return (
    <div ref={wrapperRef} className="relative mt-4 h-24 w-full overflow-visible">
      <motion.button
        type="button"
        onClick={handleNoClick}
        className="absolute left-1/2 top-1 min-w-36 -translate-x-1/2 rounded-2xl border border-rose-200/30 bg-rose-400/22 px-8 py-3 text-base font-semibold text-rose-50 shadow-[0_14px_40px_rgba(255,70,120,0.35)] backdrop-blur-xl transition-colors hover:bg-rose-400/35"
        animate={{
          x: position.x,
          y: position.y,
          rotate: position.rotate,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.7 }}
        whileTap={{ scale: 0.96 }}
      >
        Hayır
      </motion.button>
    </div>
  );
}
