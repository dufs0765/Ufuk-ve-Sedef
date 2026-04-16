"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientLayer } from "@/app/components/game/ambient-layer";
import { AudioDock } from "@/app/components/game/audio-dock";
import { BrushReveal } from "@/app/components/game/brush-reveal";
import { CharacterCard } from "@/app/components/game/character-card";
import { DodgeNoButton } from "@/app/components/game/dodge-no-button";
import { MemoryAlbum } from "@/app/components/game/memory-album";
import FruitRain from "@/app/components/HeartRain";
import { SubtleHeartRain } from "@/app/components/game/subtle-heart-rain";
import { TrueLoveConfetti } from "@/app/components/game/true-love-confetti";
import { CHARACTER_OPTIONS } from "@/app/lib/game-data";
import { useLoveGameStore, type Scene } from "@/app/store/use-love-game-store";

type SoundType = "hover" | "click" | "ambient" | "romantic" | "meme";

const ALT_BASLIK = "Askimizin Kucuk Oyunu";
const SCENE_QUERY_KEY = "sayfa";
const NOW_PLAYING_TRACK = "Kenan Doğulu - Baş Harfim Ben";

const SCENE_TO_SLUG: Record<Scene, string> = {
  landing: "ana-menu",
  character: "karakter-secimi",
  question1: "ilk-soru",
  happy: "romantik-yol",
  bad1: "kotu-son-1",
  bad2: "kotu-son-2",
  trueLove: "gercek-ask",
  album: "album",
  secret: "gizli-son",
};
const LEGACY_SLUG_TO_SCENE: Record<string, Scene> = {
  "ikinci-soru": "trueLove",
};

const SLUG_TO_SCENE: Record<string, Scene> = Object.entries(SCENE_TO_SLUG).reduce(
  (acc, [scene, slug]) => {
    acc[slug] = scene as Scene;
    return acc;
  },
  {} as Record<string, Scene>,
);

export default function Page() {
  const scene = useLoveGameStore((state) => state.scene);
  const selectedCharacter = useLoveGameStore((state) => state.selectedCharacter);
  const unlockedMemoryIds = useLoveGameStore((state) => state.unlockedMemoryIds);
  const mute = useLoveGameStore((state) => state.mute);
  const easterEggClicks = useLoveGameStore((state) => state.easterEggClicks);
  const setScene = useLoveGameStore((state) => state.setScene);
  const setCharacter = useLoveGameStore((state) => state.setCharacter);
  const unlockByEnding = useLoveGameStore((state) => state.unlockByEnding);
  const toggleMute = useLoveGameStore((state) => state.toggleMute);
  const volume = useLoveGameStore((state) => state.volume);
  const setVolume = useLoveGameStore((state) => state.setVolume);
  const registerEasterEggClick = useLoveGameStore((state) => state.registerEasterEggClick);
  const resetRun = useLoveGameStore((state) => state.resetRun);

  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [showGlitchFlash, setShowGlitchFlash] = useState(false);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const soundPlayerRef = useRef<(sound: SoundType) => void>(() => undefined);
  const hasHydratedHistoryRef = useRef(false);
  const fromPopstateRef = useRef(false);
  const cursorRafRef = useRef<number | null>(null);
  const pendingCursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateSize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (scene === "bad1" || scene === "bad2") {
      unlockByEnding("bad");
    }
    if (scene === "trueLove") {
      unlockByEnding("true");
      soundPlayerRef.current("romantic");
    }
    if (scene === "secret") {
      unlockByEnding("secret");
    }
  }, [scene, setScene, unlockByEnding]);

  useEffect(() => {
    if (easterEggClicks > 0 && easterEggClicks % 7 === 0) {
      setScene("secret");
    }
  }, [easterEggClicks, setScene]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const slug = currentUrl.searchParams.get(SCENE_QUERY_KEY);
    const initialScene = slug ? (SLUG_TO_SCENE[slug] ?? LEGACY_SLUG_TO_SCENE[slug] ?? null) : null;
    const currentScene = useLoveGameStore.getState().scene;

    if (initialScene) {
      setScene(initialScene);
    } else {
      currentUrl.searchParams.set(SCENE_QUERY_KEY, SCENE_TO_SLUG[currentScene]);
      window.history.replaceState({ scene: currentScene }, "", currentUrl.toString());
    }

    hasHydratedHistoryRef.current = true;

    const onPopState = () => {
      const poppedUrl = new URL(window.location.href);
      const poppedSlug = poppedUrl.searchParams.get(SCENE_QUERY_KEY);
      const nextScene = poppedSlug ? SLUG_TO_SCENE[poppedSlug] : "landing";
      fromPopstateRef.current = true;
      setScene(nextScene ?? "landing");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setScene]);

  useEffect(() => {
    if (!hasHydratedHistoryRef.current) return;

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set(SCENE_QUERY_KEY, SCENE_TO_SLUG[scene]);

    if (fromPopstateRef.current) {
      fromPopstateRef.current = false;
      window.history.replaceState({ scene }, "", nextUrl.toString());
      return;
    }

    window.history.pushState({ scene }, "", nextUrl.toString());
  }, [scene]);

  const goTo = useCallback(
    (nextScene: Scene) => {
      soundPlayerRef.current("click");
      if (nextScene === "character" || nextScene === "question1") {
        soundPlayerRef.current("ambient");
      }
      setScene(nextScene);
    },
    [setScene],
  );

  const triggerBadEnding = useCallback(
    (badScene: "bad1" | "bad2") => {
      soundPlayerRef.current("click");
      setShowGlitchFlash(true);
      setTimeout(() => setShowGlitchFlash(false), 260);
      setScene(badScene);
    },
    [setScene],
  );

  const spotlightStyle = useMemo(
    () => ({
      background: `radial-gradient(320px circle at ${cursor.x}px ${cursor.y}px, rgba(123,182,255,0.14), transparent 62%)`,
    }),
    [cursor.x, cursor.y],
  );
  const globalFruitMode: "mixed" | "orange" | "olive" =
    scene === "landing" || scene === "character" || scene === "album" || scene === "secret"
      ? "mixed"
      : selectedCharacter === "Dufs"
        ? "orange"
        : selectedCharacter === "Šedf"
          ? "olive"
          : "mixed";
  const globalOliveTone: "mixed" | "green" =
    scene === "bad1" || scene === "bad2" ? "green" : "mixed";
  const firstQuestionTitle =
    selectedCharacter === "Šedf"
      ? "Tatlıya tatlı verilmez ama tatlım olur musun?"
      : "Güle gül verilmez ama gülüm olur musun?";

  const handleVolumeChange = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    setVolume(clamped);
    if (clamped <= 0.01 && !mute) {
      toggleMute();
    } else if (clamped > 0.01 && mute) {
      toggleMute();
    }
  };

  const handleToggleAudioPanel = useCallback(() => {
    setShowAudioPanel((value) => !value);
    if (!mute) {
      soundPlayerRef.current("ambient");
    }
  }, [mute]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setScene("landing");
  }, [setScene]);

  useEffect(() => {
    return () => {
      if (cursorRafRef.current != null) {
        cancelAnimationFrame(cursorRafRef.current);
      }
    };
  }, []);

  return (
    <main
      className="relative min-h-dvh overflow-hidden px-4 py-6 text-white sm:px-8 sm:py-8"
      onMouseMove={(event) => {
        pendingCursorRef.current = { x: event.clientX, y: event.clientY };
        if (cursorRafRef.current != null) return;
        cursorRafRef.current = requestAnimationFrame(() => {
          cursorRafRef.current = null;
          const p = pendingCursorRef.current;
          setCursor({ x: p.x, y: p.y });
        });
      }}
    >
      <AmbientLayer />
      <div className="pointer-events-none fixed inset-0 z-[1] transition-opacity" style={spotlightStyle} />
      <AudioDock mute={mute} volume={volume} onReady={(play) => { soundPlayerRef.current = play; }} />
      <AudioControls
        volume={volume}
        mute={mute}
        expanded={showAudioPanel}
        currentTrackLabel={NOW_PLAYING_TRACK}
        onToggleExpanded={handleToggleAudioPanel}
        onVolumeChange={handleVolumeChange}
      />
      <SubtleHeartRain mode={globalFruitMode} oliveTone={globalOliveTone} />
      {(scene === "landing" || scene === "character") && <FloatingEvilTaz />}

      {scene !== "landing" && <MenuButton onClick={goBack} />}

      <AnimatePresence>
        {showGlitchFlash && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[92] bg-white/30 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.12, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl items-center justify-center sm:min-h-dvh">
        <AnimatePresence mode="wait">
          {scene === "landing" && (
            <SceneShell key="landing">
              <div className="relative w-full max-w-3xl overflow-hidden px-4 py-10 sm:px-6 sm:py-12">
                <div className="relative z-10 flex flex-col">
                    <motion.h1
                      className="text-5xl font-semibold tracking-tight sm:text-6xl"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Dufs & Šedf
                    </motion.h1>
                    <button
                      type="button"
                      onClick={() => {
                        registerEasterEggClick();
                        soundPlayerRef.current("hover");
                      }}
                      className="mt-3 w-fit text-xs uppercase tracking-[0.28em] text-white/65 transition hover:text-white"
                    >
                      {ALT_BASLIK}
                    </button>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                      Van Gölü Canavarı ile Doğubeyazıt Kraliçesinin aşk dolu savaşı.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <PremiumButton title="Oyuna Başla" onClick={() => goTo("character")} tone="light" />
                      <PremiumButton title="Albüm Modu" onClick={() => goTo("album")} />
                    </div>
                </div>
              </div>
            </SceneShell>
          )}

          {scene === "character" && (
            <SceneShell key="character">
              <div className="w-full max-w-4xl p-3 sm:p-4">
                <p className="text-center text-xs uppercase tracking-[0.35em] text-white/55">Karakter Seçimi</p>
                <h2 className="mt-3 text-center text-3xl font-semibold">Kimi Seçiyorsun?</h2>
                <p className="mt-2 text-center text-sm text-white/60">Kalbin kimin için atıyor?</p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {CHARACTER_OPTIONS.map((character) => (
                    <CharacterCard
                      key={character.id}
                      title={character.title}
                      role={character.role}
                      image={character.image}
                      accent={character.accent}
                      onSelect={() => {
                        setCharacter(character.id);
                        goTo("question1");
                      }}
                    />
                  ))}
                </div>
              </div>
            </SceneShell>
          )}

          {scene === "question1" && (
            <SceneShell key="question1">
              <QuestionCard
                title={firstQuestionTitle}
                yesLabel="Evet"
                onYes={() => goTo("happy")}
                yesRef={yesButtonRef}
                onNo={() => triggerBadEnding("bad1")}
                dodgeBeforeClick={2}
              />
            </SceneShell>
          )}

          {scene === "happy" && (
            <SceneShell key="happy">
              <div className="w-full max-w-5xl p-3 sm:p-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-3xl font-semibold"
                >
                  Kalbin Doğru Yolu Seçti
                </motion.h2>
                <p className="mt-2 text-center text-sm text-white/65">
                  {selectedCharacter ?? "Sen"} seçimi yaptı, romantik sahne açıldı.
                </p>
                <PolaroidStack />
                <div className="mt-8 text-center">
                  <PremiumButton title="Devam Et" onClick={() => goTo("trueLove")} compact />
                </div>
              </div>
            </SceneShell>
          )}

          {(scene === "bad1" || scene === "bad2") && (
            <SceneShell key={scene}>
              <motion.div
                className="w-full max-w-5xl p-7 sm:p-10"
                animate={{ x: [0, -10, 9, -6, 4, 0] }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">Kötü Son</p>
                <h2 className="mt-3 text-4xl font-semibold">
                  {scene === "bad1" ? "Kalp Bu Cevabı Kaldıramadı..." : "Yanlış Seçim Zinciri Başladı..."}
                </h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <BrushReveal image="/photos/bad-real-1.png" title="Tripler Tavan" />
                  <BrushReveal image="/photos/bad-real-2.png" title="Kaşlar Çatık" delay={0.2} />
                </div>
                <div className="mt-9 flex flex-col items-center gap-3 text-center">
                  <p className="text-4xl font-black tracking-[0.15em] text-red-300/85">So So Sorry Man.</p>
                  <p className="text-sm text-rose-100/70">Yanlış seçim yaptın.</p>
                  <div className="flex gap-3">
                    <PremiumButton title="Tekrar Dene" onClick={() => { resetRun(); goTo("character"); }} compact />
                    <PremiumButton title="Albüm Modu" onClick={() => goTo("album")} compact />
                  </div>
                </div>
              </motion.div>
            </SceneShell>
          )}

          {scene === "trueLove" && (
            <SceneShell key="trueLove">
              <FruitRain
                count={10}
                loop={false}
                mode={selectedCharacter === "Dufs" ? "orange" : selectedCharacter === "Šedf" ? "olive" : "mixed"}
                oliveTone={globalOliveTone}
              />
              <SparkleRain once sparkleCount={12} />
              <TrueLoveConfetti
                width={windowSize.w}
                height={windowSize.h}
                style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 85 }}
              />
              <motion.div
                className="relative w-full max-w-5xl overflow-hidden rounded-[2.2rem] border border-emerald-200/20 bg-gradient-to-br from-[#0a1321]/82 via-[#111a2a]/72 to-[#1b1230]/78 p-8 text-center shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.2, 0.85, 0.2, 1] }}
              >
                <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-4 h-64 w-64 rounded-full bg-fuchsia-300/14 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.17),transparent_48%)]" />
                <span className="relative inline-flex rounded-full border border-emerald-200/35 bg-emerald-300/12 px-4 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-100">
                  Final Sahne
                </span>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative mt-4 text-4xl font-black tracking-[0.12em] text-emerald-100 sm:text-5xl"
                >
                  Gerçek Aşk Kazandı
                </motion.h2>
                <p className="relative mt-3 text-lg text-white/85">
                  Sonsuza Dek ❤️
                </p>
                <p className="relative mx-auto mt-2 max-w-2xl text-sm text-white/72">
                  Bu hikayenin en güzel sonu açıldı.
                </p>
                <div className="relative mt-10 flex flex-wrap justify-center gap-3">
                  <PremiumButton title="Albüme git" onClick={() => goTo("album")} compact />
                  <PremiumButton title="Baştan Oyna" onClick={() => { resetRun(); goTo("character"); }} compact />
                </div>
              </motion.div>
            </SceneShell>
          )}

          {scene === "secret" && (
            <SceneShell key="secret">
              <div className="premium-panel w-full max-w-3xl p-8 text-center sm:p-11">
                <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/70">Gizli Rota</p>
                <h2 className="mt-3 text-4xl font-semibold">Tutulma Sonu Bulundu</h2>
                <p className="mt-3 text-sm text-white/70">
                  Alt başlığa 7 kez dokunarak gizli sahneyi açtın.
                </p>
                <div className="mx-auto mt-7 max-w-xl overflow-hidden rounded-3xl border border-white/20">
                  <Image src="/photos/secret-eclipse.svg" alt="Gizli son görseli" width={900} height={500} className="h-auto w-full" />
                </div>
                <div className="mt-7 flex justify-center gap-3">
                  <PremiumButton title="Albüm Modu" onClick={() => goTo("album")} compact />
                  <PremiumButton title="Ana Sayfa" onClick={() => goTo("landing")} compact />
                </div>
              </div>
            </SceneShell>
          )}

          {scene === "album" && (
            <SceneShell key="album">
              <div className="w-full rounded-[2rem] border border-white/10 bg-transparent p-7 shadow-[0_20px_40px_rgba(0,0,0,0.18)] sm:p-10">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Albüm Modu</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Anı Arşivi</h2>
                    <p className="mt-2 text-sm text-white/65">Fotoları gördükçe albüme eklenir, görmediklerin kilitli kalır.</p>
                  </div>
                </div>
                <MemoryAlbum unlockedMemoryIds={unlockedMemoryIds} />
              </div>
            </SceneShell>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed left-5 top-5 z-[91] inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs tracking-[0.16em] text-white/85 transition hover:bg-white/20"
    >
      <span>◂</span>
      Geri
    </button>
  );
}

function FloatingEvilTaz() {
  return (
    <motion.div
      className="pointer-events-none fixed right-2 top-16 z-[88] sm:right-4 lg:right-6 lg:top-14"
      initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
      animate={{
        opacity: 0.98,
        y: [0, -10, 0],
        rotate: [-5, 3, -5],
        scale: [1, 1.04, 1],
      }}
      transition={{
        opacity: { duration: 0.35, ease: "easeOut" },
        y: { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        rotate: { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        scale: { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="absolute inset-3 -z-10 rounded-full bg-red-400/15 blur-2xl"
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <Image
        src="/stickers/taz-evil.png"
        alt="Evil Taz dekoru"
        width={210}
        height={210}
        priority
        className="h-auto w-[118px] drop-shadow-[0_16px_30px_rgba(0,0,0,0.48)] sm:w-[150px] lg:w-[190px]"
      />
    </motion.div>
  );
}

function AudioControls({
  volume,
  mute,
  expanded,
  currentTrackLabel,
  onToggleExpanded,
  onVolumeChange,
}: {
  volume: number;
  mute: boolean;
  expanded: boolean;
  currentTrackLabel: string;
  onToggleExpanded: () => void;
  onVolumeChange: (value: number) => void;
}) {
  const isMutedVisual = mute || volume <= 0.01;

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/55 text-lg transition hover:bg-black/70"
        aria-label="Ses kontrolleri"
      >
        <span>🔊</span>
        {isMutedVisual && (
          <motion.span
            className="pointer-events-none absolute h-[2px] w-7 rotate-[-34deg] rounded-full bg-red-500"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </button>
      {expanded && (
        <div className="absolute bottom-14 right-0 w-44 rounded-2xl border border-white/20 bg-[#0a101b]/95 p-3">
          <p className="text-[10px] leading-relaxed text-white/70">
            Orada çalan müzik:
            <span className="mt-1 block text-[11px] text-white">
              {mute ? "Kapalı (Ses kapalı)" : currentTrackLabel}
            </span>
          </p>
          <label className="block text-[11px] text-white/70">
            Ses Seviyesi
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              className="mt-2 w-full accent-slate-300"
            />
          </label>
          <p className="mt-2 text-[10px] text-white/45">
            Sona çekince otomatik kapanır
          </p>
        </div>
      )}
    </div>
  );
}

function SceneShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.52, ease: [0.2, 0.9, 0.2, 1] }}
      className="relative w-full"
    >
      {children}
    </motion.section>
  );
}

function PremiumButton({
  title,
  onClick,
  danger,
  compact,
  tone = "cyan",
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
  compact?: boolean;
  tone?: "cyan" | "light";
}) {
  const toneClass = danger
    ? "border-rose-300/35 bg-rose-500/25 hover:bg-rose-500/35"
    : tone === "light"
      ? "border-white/70 bg-white text-black hover:bg-white/95"
      : "border-white/20 bg-[#0d1627]/70 text-white hover:bg-[#121f35]/85";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={`relative overflow-hidden rounded-2xl border px-6 font-medium tracking-wide ${
        compact ? "py-3 text-sm" : "py-4 text-base"
      } ${toneClass} ${tone === "light" && !danger ? "shadow-[0_10px_24px_rgba(255,255,255,0.18)]" : "shadow-[0_10px_24px_rgba(0,0,0,0.35)]"}`}
    >
      <span className={`relative z-10 ${tone === "light" && !danger ? "text-black" : "text-white/92"}`}>{title}</span>
      <motion.span
        className="pointer-events-none absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        style={{
          background:
            "linear-gradient(100deg, transparent 8%, rgba(255,255,255,0.35), transparent 80%)",
        }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      />
    </motion.button>
  );
}

function QuestionCard({
  title,
  yesLabel,
  onYes,
  onNo,
  yesRef,
  dodgeBeforeClick,
}: {
  title: string;
  yesLabel: string;
  onYes: () => void;
  onNo: () => void;
  yesRef: React.RefObject<HTMLButtonElement | null>;
  dodgeBeforeClick: number;
}) {
  return (
    <div className="w-full max-w-xl p-7 text-center sm:p-10">
      <motion.h2
        initial={{ opacity: 0, y: 20, letterSpacing: "0.02em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.01em" }}
        transition={{ duration: 0.65 }}
        className="text-4xl font-semibold"
        style={{ textShadow: "0 0 0px rgba(180,210,255,0.0)" }}
        whileInView={{
          textShadow: [
            "0 0 0px rgba(180,210,255,0.0)",
            "0 0 18px rgba(162,196,255,0.35)",
            "0 0 8px rgba(120,140,180,0.25)",
          ],
        }}
      >
        {title}
      </motion.h2>
      <motion.button
        ref={yesRef}
        type="button"
        onClick={onYes}
        className="relative mt-10 w-full overflow-hidden rounded-2xl border border-slate-300/30 bg-gradient-to-r from-[#151922] to-[#07090d] py-4 text-lg font-semibold shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition"
        whileHover={{ scale: 1.02, boxShadow: "0 16px 36px rgba(0,0,0,0.55)" }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            "0 12px 30px rgba(0,0,0,0.4)",
            "0 18px 38px rgba(0,0,0,0.58)",
            "0 12px 30px rgba(0,0,0,0.4)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 1.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <span className="relative z-10">{yesLabel}</span>
      </motion.button>
      <DodgeNoButton yesButtonRef={yesRef} onClick={onNo} dodgeBeforeClick={dodgeBeforeClick} />
    </div>
  );
}

function PolaroidStack() {
  const cards = [
    {
      title: "Öpücük Yağmuru",
      src: "/photos/happy-real-1.png",
      imageClass: "object-[50%_76%]",
      cardClass: "w-[11rem] sm:w-[13rem]",
      frameClass: "aspect-[3/4]",
    },
    {
      title: "Ayna Pozu",
      src: "/photos/happy-real-2.png",
      imageClass: "object-center",
      cardClass: "w-[11rem] sm:w-[13rem]",
      frameClass: "aspect-[3/4]",
    },
    {
      title: "Gül Sürprizi",
      src: "/photos/happy-real-3.png",
      imageClass: "object-[54%_22%] scale-[1.52]",
      cardClass: "w-[13rem] sm:w-[13rem]",
      frameClass: "aspect-[4/3] sm:aspect-[3/4]",
    },
  ];
  const placements = [
    "left-[2%] top-[0%] -rotate-[8deg] z-20 sm:left-[8%] sm:top-[10%] sm:-rotate-[7deg]",
    "right-[2%] top-[2%] rotate-[6deg] z-30 sm:left-[36%] sm:top-[4%] sm:rotate-[5deg]",
    "left-1/2 top-[56%] -translate-x-1/2 -rotate-[2deg] z-10 sm:left-[62%] sm:top-[12%] sm:translate-x-0 sm:-rotate-[3deg]",
  ];

  return (
    <div className="relative mt-10 min-h-[28rem] sm:min-h-[22rem]">
      {cards.map((card, index) => (
        <motion.div
          key={`${card.title}-${index}`}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: index * 0.18 }}
          className={`absolute overflow-hidden rounded-2xl border border-white/30 bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)] ${card.cardClass} ${placements[index]}`}
        >
          <div className={`relative overflow-hidden rounded-xl ${card.frameClass}`}>
            <Image
              src={card.src}
              alt={card.title}
              fill
              sizes="(max-width: 640px) 44vw, 240px"
              className={`object-cover ${card.imageClass}`}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <p className="pt-2 text-center text-sm font-medium text-black/75">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}

function SparkleRain({ once = false, sparkleCount = 26 }: { once?: boolean; sparkleCount?: number }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: sparkleCount }, (_, index) => {
        const seed = (index + 1) * 1.521;
        const frac = (value: number) => value - Math.floor(value);
        return {
          id: index,
          left: `${frac(seed * 7.23) * 100}%`,
          delay: frac(seed * 3.9) * 5,
          duration: 3 + frac(seed * 9.17) * 2.5,
          size: 4 + frac(seed * 6.11) * 5,
        };
      }),
    [sparkleCount],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[84]">
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute text-yellow-100/80"
          style={{ left: sparkle.left, top: "8%", fontSize: sparkle.size }}
          animate={{ y: ["0vh", "80vh"], opacity: [0, 1, 0], scale: [0.6, 1.15, 0.75] }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: once ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}
