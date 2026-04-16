"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type TrueLoveConfettiProps = {
  width: number;
  height: number;
  style?: CSSProperties;
};

export function TrueLoveConfetti({ width, height, style }: TrueLoveConfettiProps) {
  if (width <= 0 || height <= 0) return null;
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={64}
      recycle={false}
      gravity={0.12}
      tweenDuration={4000}
      colors={["#f9a8d4", "#93c5fd", "#fef08a", "#e9d5ff"]}
      style={style}
    />
  );
}
