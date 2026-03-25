import { create } from 'zustand';
import { Music } from '../types/music';

interface PlayerState {
  currentIndex: number | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

interface MusicStore {
  songs: Music[];
  searchQuery: string;
  player: PlayerState;
  isUploadModalOpen: boolean;
  isAdminMode: boolean;
  isLightMode: boolean;

  setSongs: (songs: Music[]) => void;
  addSong: (song: Music) => void;
  removeSong: (id: string) => void;
  setSearchQuery: (q: string) => void;

  playSong: (index: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (v: number) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;

  openUploadModal: () => void;
  closeUploadModal: () => void;
  toggleAdminMode: () => void;
  toggleLightMode: () => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  songs: [],
  searchQuery: '',
  isUploadModalOpen: false,
  isAdminMode: false,
  isLightMode: false,
  player: {
    currentIndex: null,
    isPlaying: false,
    volume: 0.8,
    currentTime: 0,
    duration: 0,
  },

  setSongs: (songs) => set({ songs }),
  addSong: (song) => set((s) => ({ songs: [song, ...s.songs] })),
  removeSong: (id) => {
    const { songs, player } = get();
    const removedIdx = songs.findIndex((s) => s.id === id);
    const updated = songs.filter((s) => s.id !== id);
    if (player.currentIndex === removedIdx) {
      set({ songs: updated, player: { ...player, currentIndex: null, isPlaying: false } });
    } else {
      set({ songs: updated });
    }
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  playSong: (index) => set((s) => ({ player: { ...s.player, currentIndex: index, isPlaying: true, currentTime: 0 } })),
  togglePlay: () => set((s) => ({ player: { ...s.player, isPlaying: !s.player.isPlaying } })),
  nextSong: () => {
    const { songs, player } = get();
    if (!songs.length) return;
    const next = player.currentIndex === null ? 0 : (player.currentIndex + 1) % songs.length;
    set({ player: { ...player, currentIndex: next, isPlaying: true, currentTime: 0 } });
  },
  prevSong: () => {
    const { songs, player } = get();
    if (!songs.length) return;
    const prev = player.currentIndex === null ? 0 : (player.currentIndex - 1 + songs.length) % songs.length;
    set({ player: { ...player, currentIndex: prev, isPlaying: true, currentTime: 0 } });
  },
  setVolume: (v) => set((s) => ({ player: { ...s.player, volume: v } })),
  setCurrentTime: (t) => set((s) => ({ player: { ...s.player, currentTime: t } })),
  setDuration: (d) => set((s) => ({ player: { ...s.player, duration: d } })),
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  toggleAdminMode: () => set((s) => ({ isAdminMode: !s.isAdminMode })),
  toggleLightMode: () => set((s) => ({ isLightMode: !s.isLightMode })),
}));
