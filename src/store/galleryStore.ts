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
  setImages: (locale: string, images: GalleryImageApiItem[]) => void;
  hasImages: (locale: string) => boolean;
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: {},
  setImages: (locale, images) =>
    set((state) => ({ images: { ...state.images, [locale]: images } })),
  hasImages: (locale) => {
    const imgs = get().images[locale];
    return Array.isArray(imgs) && imgs.length > 0;
  },
}));
