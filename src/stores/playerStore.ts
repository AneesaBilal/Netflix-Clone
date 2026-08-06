import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  setPlaying: (value: boolean) => void;
  setTime: (currentTime: number, duration?: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setTime: (currentTime, duration) =>
    set((state) => ({ currentTime, duration: duration ?? state.duration })),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
}));
