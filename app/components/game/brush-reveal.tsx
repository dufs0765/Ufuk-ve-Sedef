"use client";

import Image from "next/image";
import { assetUrl } from "@/app/lib/asset-path";
import { motion } from "framer-motion";

type BrushRevealProps = {
  image: string;
  title: string;
  delay?: number;
};

export function BrushReveal({ image, title, delay = 0 }: BrushRevealProps) {
  return (
    <motion.div
      className="relative h-48 overflow-hidden rounded-3xl border border-white/15 bg-black/50 sm:h-64"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}
        className="absolute inset-0"
      >
        <Image src={assetUrl(image)} alt={title} fill className="object-cover" sizes="(max-width: 768px) 90vw, 40vw" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="absolute bottom-4 left-4 text-sm font-medium text-white/90">{title}</p>
    </motion.div>
  );
}
