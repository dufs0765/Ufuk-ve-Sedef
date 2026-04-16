"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Scene =
  | "landing"
  | "character"
  | "question1"
  | "bad1"
  | "happy"
  | "bad2"
  | "trueLove"
  | "album"
  | "secret";

type EndingType = "bad" | "true" | "secret";
type Character = "Dufs" | "Šedf" | null;

type LoveGameState = {
  scene: Scene;
  selectedCharacter: Character;
  unlockedMemoryIds: string[];
  mute: boolean;
  volume: number;
  easterEggClicks: number;
  setScene: (scene: Scene) => void;
  setCharacter: (character: Exclude<Character, null>) => void;
  unlockMemories: (memoryIds: string[]) => void;
  unlockByEnding: (ending: EndingType) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  registerEasterEggClick: () => void;
  resetRun: () => void;
};

const ENDING_MEMORY_MAP: Record<EndingType, string[]> = {
  bad: [],
  true: [
    "album-01",
    "album-02",
    "album-03",
    "album-04",
    "album-05",
    "album-06",
    "album-07",
    "album-08",
    "album-09",
    "album-10",
    "album-11",
    "album-12",
    "album-13",
    "album-14",
    "album-15",
    "album-16",
    "album-17",
    "album-18",
  ],
  secret: [],
};

export const useLoveGameStore = create<LoveGameState>()(
  persist(
    (set) => ({
      scene: "landing",
      selectedCharacter: null,
      unlockedMemoryIds: [],
      mute: false,
      volume: 1,
      easterEggClicks: 0,
      setScene: (scene) => set({ scene }),
      setCharacter: (character) => set({ selectedCharacter: character }),
      unlockMemories: (memoryIds) =>
        set((state) => ({
          unlockedMemoryIds: [...new Set([...state.unlockedMemoryIds, ...memoryIds])],
        })),
      unlockByEnding: (ending) =>
        set((state) => ({
          unlockedMemoryIds: [...new Set([...state.unlockedMemoryIds, ...ENDING_MEMORY_MAP[ending]])],
        })),
      toggleMute: () => set((state) => ({ mute: !state.mute })),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      registerEasterEggClick: () =>
        set((state) => ({ easterEggClicks: state.easterEggClicks + 1 })),
      resetRun: () =>
        set({
          scene: "landing",
          selectedCharacter: null,
          easterEggClicks: 0,
        }),
    }),
    {
      name: "dufs-šedf-premium-save",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        unlockedMemoryIds: state.unlockedMemoryIds,
        mute: state.mute,
        volume: state.volume,
      }),
    },
  ),
);
