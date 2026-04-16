"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MEMORY_ITEMS } from "@/app/lib/game-data";

type MemoryAlbumProps = {
  unlockedMemoryIds: string[];
};

export function MemoryAlbum({ unlockedMemoryIds }: MemoryAlbumProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const unlockedSet = useMemo(() => new Set(unlockedMemoryIds), [unlockedMemoryIds]);

  const memories = useMemo(
    () =>
      MEMORY_ITEMS
        .sort((a, b) => Number(unlockedSet.has(b.id)) - Number(unlockedSet.has(a.id))),
    [unlockedSet],
  );
  const unlockedCount = MEMORY_ITEMS.filter((item) => unlockedSet.has(item.id)).length;
  const progress = Math.round((unlockedCount / MEMORY_ITEMS.length) * 100);

  return (
    <section className="w-full max-w-6xl">
      <div className="mb-6 rounded-3xl border border-white/15 bg-gradient-to-br from-[#111a2a]/80 via-[#0c1524]/75 to-[#0a1120]/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Anı Senkronu</p>
            <p className="mt-1 text-sm text-white/85">
              {unlockedCount}/{MEMORY_ITEMS.length} anı açıldı
            </p>
          </div>
          <p className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xl font-semibold text-cyan-100">
            {progress}%
          </p>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => {
          const isUnlocked = unlockedSet.has(memory.id);
          return (
            <motion.button
              key={memory.id}
              type="button"
              onClick={() => isUnlocked && setLightbox(memory.id)}
              className="group overflow-hidden rounded-3xl border border-white/65 bg-white text-left shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
              whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 19 }}
            >
              <div className="bg-white p-2">
                <Image
                  src={memory.image}
                  alt={memory.title}
                  width={1200}
                  height={1600}
                  className={`h-auto w-full rounded-2xl transition duration-500 ${isUnlocked ? "group-hover:scale-[1.015]" : "blur-sm brightness-75"}`}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="border-t border-black/10 bg-white/95 p-3">
                <p className="text-sm font-semibold text-black/90">{memory.title}</p>
                <p className="mt-0.5 text-xs text-black/65">{memory.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      {memories.length === 0 && (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-6 text-center text-sm text-white/65">
          Bu bölüm henüz boş. Yeni rotalar oynayarak açabilirsin.
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="presentation"
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative mx-auto flex h-[min(88dvh,92vw)] w-[min(96vw,1200px)] items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-[1] rounded-full border border-white/25 bg-black/70 px-3 py-1.5 text-xs text-white/90 transition hover:bg-white/15"
              >
                Kapat
              </button>
              <Image
                src={MEMORY_ITEMS.find((item) => item.id === lightbox)?.image ?? "/photos/album/album-01.svg"}
                alt="Anı tam görünüm"
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 1280px) 96vw, 1200px"
              />
              <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-white/55">
                Dışarı tıkla veya Kapat
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
