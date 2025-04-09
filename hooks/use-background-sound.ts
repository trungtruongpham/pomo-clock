"use client";

import { create } from "zustand";

type BackgroundSound = "rain" | "forest" | "coffee" | null;

interface BackgroundSoundStore {
  currentSound: BackgroundSound;
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  volume: number;
  setSound: (sound: BackgroundSound) => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  stopSound: () => void;
}

export const useBackgroundSound = create<BackgroundSoundStore>((set, get) => ({
  currentSound: null,
  audioElement: null,
  isPlaying: false,
  volume: 0.5,

  setSound: (sound) => {
    const { audioElement, stopSound } = get();

    // Stop current sound if playing
    if (audioElement) {
      stopSound();
    }

    if (!sound) {
      set({ currentSound: null });
      return;
    }

    // Create new audio element
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.loop = true;
    audio.volume = get().volume;

    // Play the sound
    audio.play().catch(console.error);

    set({
      currentSound: sound,
      audioElement: audio,
      isPlaying: true,
    });
  },

  setVolume: (volume) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = volume;
    }
    set({ volume });
  },

  togglePlay: () => {
    const { audioElement, isPlaying } = get();
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(console.error);
    }

    set({ isPlaying: !isPlaying });
  },

  stopSound: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    set({
      audioElement: null,
      currentSound: null,
      isPlaying: false,
    });
  },
}));
