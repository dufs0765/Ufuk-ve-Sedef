"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type CharacterCardProps = {
  title: string;
  role: string;
  image: string;
  accent: string;
  onSelect: () => void;
};

export function CharacterCard({ title, role, image, accent, onSelect }: CharacterCardProps) {
  const avatarClassName =
    image === "/photos/avatar-sedef-real.png"
      ? "object-cover object-[56%_28%]"
      : image === "/photos/avatar-ufuk-real.png"
        ? "object-cover object-[52%_24%] scale-[1.38]"
        : "object-cover";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-5 text-left backdrop-blur-2xl transition-colors hover:bg-white/[0.07]"
      whileHover={{ rotateX: -6, rotateY: 7, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative z-10 flex items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
          <Image src={image} alt={title} fill className={avatarClassName} sizes="80px" />
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-wide text-white">{title}</h3>
          <p className="mt-1 text-xs text-white/60">{role}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent [background:linear-gradient(130deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_40%,rgba(100,150,255,0.3))_border-box] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />
    </motion.button>
  );
}
