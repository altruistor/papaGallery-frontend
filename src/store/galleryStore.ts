import { create } from "zustand";

export type GalleryImageApiItem = {
  id: number;
  Name: string;
  Alt: string;
  Description: string;
  Category: string;
  Image?: {
    url?: string;
    formats?: {
      medium?: {
        url?: string;
      };
    };
  };
};

type GalleryStore = {
  // ключ — locale, чтобы не путать ru и en галереи
  images: Record<string, GalleryImageApiItem[]>;
  animated: Record<string, boolean>; // анимация уже сыграла для этой локали
  setImages: (locale: string, images: GalleryImageApiItem[]) => void;
  markAnimated: (locale: string) => void;
  hasImages: (locale: string) => boolean;
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: {},
  animated: {},
  setImages: (locale, images) =>
    set((state) => ({ images: { ...state.images, [locale]: images } })),
  markAnimated: (locale) =>
    set((state) => ({ animated: { ...state.animated, [locale]: true } })),
  hasImages: (locale) => {
    const imgs = get().images[locale];
    return Array.isArray(imgs) && imgs.length > 0;
  },
}));
