"use client";

import { useCallback, useEffect, useRef } from "react";

type SoundType = "hover" | "click" | "ambient" | "romantic" | "meme";

type AudioDockProps = {
  mute: boolean;
  volume: number;
  onReady?: (play: (sound: SoundType) => void) => void;
};

const AMBIENT_TIME_STORAGE_KEY = "love-game-ambient-time";
let sharedAmbientAudio: HTMLAudioElement | null = null;
let sharedAmbientTime = 0;

export function AudioDock({ mute, volume, onReady }: AudioDockProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientTrackRef = useRef<HTMLAudioElement | null>(null);
  const clashRef = useRef<HTMLAudioElement | null>(null);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const blip = useCallback((freq: number, duration: number, gain = 0.04) => {
    if (mute) return;
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.value = gain * volume;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  }, [ensureContext, mute, volume]);

  const startAmbientTrack = useCallback(() => {
    if (mute) return;
    if (!ambientTrackRef.current) {
      if (!sharedAmbientAudio) {
        sharedAmbientAudio = new Audio("/sounds/kenan-bas-harfim-ben.mp3");
        sharedAmbientAudio.loop = true;
        sharedAmbientAudio.preload = "auto";
      }

      if (sharedAmbientTime <= 0) {
        try {
          const savedTime = Number(sessionStorage.getItem(AMBIENT_TIME_STORAGE_KEY) ?? "0");
          if (Number.isFinite(savedTime) && savedTime > 0) {
            sharedAmbientTime = savedTime;
          }
        } catch {}
      }

      if (sharedAmbientAudio.currentTime < 0.1 && sharedAmbientTime > 0.5) {
        try {
          sharedAmbientAudio.currentTime = sharedAmbientTime;
        } catch {}
      }

      ambientTrackRef.current = sharedAmbientAudio;
    }
    ambientTrackRef.current.volume = Math.max(0, Math.min(1, volume * 0.45));
    void ambientTrackRef.current.play().catch(() => {});
  }, [mute, volume]);

  useEffect(() => {
    const play = (sound: SoundType) => {
      if (sound === "hover") blip(380, 0.08, 0.018);
      if (sound === "click") {
        blip(420, 0.08, 0.03);
        setTimeout(() => blip(610, 0.08, 0.02), 60);
      }
      if (sound === "meme") {
        if (mute) return;
        if (!clashRef.current) {
          clashRef.current = new Audio("/sounds/clash-kral-sinirli.mp3");
        }
        clashRef.current.volume = Math.max(0, Math.min(1, volume));
        clashRef.current.currentTime = 0;
        void clashRef.current.play().catch(() => {});
      }
      if (sound === "romantic") {
        blip(330, 0.25, 0.03);
        setTimeout(() => blip(495, 0.25, 0.028), 180);
        setTimeout(() => blip(660, 0.28, 0.026), 360);
      }
      if (sound === "ambient") {
        startAmbientTrack();
      }
    };

    onReady?.(play);
  }, [onReady, blip, mute, volume, startAmbientTrack]);

  useEffect(() => {
    if (mute) return;
    startAmbientTrack();
    const retryTimer = window.setInterval(() => {
      if (!ambientTrackRef.current || !ambientTrackRef.current.paused) return;
      startAmbientTrack();
    }, 5000);
    const persistTimer = window.setInterval(() => {
      if (!sharedAmbientAudio || sharedAmbientAudio.paused) return;
      sharedAmbientTime = sharedAmbientAudio.currentTime;
      try {
        sessionStorage.setItem(AMBIENT_TIME_STORAGE_KEY, String(sharedAmbientTime));
      } catch {}
    }, 3000);
    return () => {
      window.clearInterval(retryTimer);
      window.clearInterval(persistTimer);
    };
  }, [mute, startAmbientTrack]);

  useEffect(() => {
    if (!ambientTrackRef.current) return;

    ambientTrackRef.current.volume = Math.max(0, Math.min(1, volume * 0.45));
    if (mute) {
      sharedAmbientTime = ambientTrackRef.current.currentTime;
      ambientTrackRef.current.pause();
    } else {
      void ambientTrackRef.current.play().catch(() => {});
    }
  }, [mute, volume]);

  useEffect(() => {
    return () => {
      if (ambientTrackRef.current) {
        sharedAmbientTime = ambientTrackRef.current.currentTime;
      }
      ambientTrackRef.current = null;
      clashRef.current?.pause();
      clashRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return null;
}
