import { create } from "zustand";

type VibrateState = {
  vibrate: boolean;
  setVibrate: (value: boolean) => void;
};

export const useVibrateStore = create<VibrateState>((set) => ({
  vibrate: false,
  setVibrate: (value) => set({ vibrate: value }),
}));
