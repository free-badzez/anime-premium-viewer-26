
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CustomImageStore = {
  customImages: Record<number, string>;
  setCustomImage: (animeId: number, imageUrl: string) => void;
  getCustomImage: (animeId: number) => string | null;
  removeCustomImage: (animeId: number) => void;
};

export const useCustomImageStore = create<CustomImageStore>()(
  persist(
    (set, get) => ({
      customImages: {},
      
      setCustomImage: (animeId, imageUrl) => {
        set((state) => ({
          customImages: {
            ...state.customImages,
            [animeId]: imageUrl,
          }
        }));
      },
      
      getCustomImage: (animeId) => {
        return get().customImages[animeId] || null;
      },
      
      removeCustomImage: (animeId) => {
        set((state) => {
          const newImages = { ...state.customImages };
          delete newImages[animeId];
          return { customImages: newImages };
        });
      }
    }),
    {
      name: 'anime-custom-images',
    }
  )
);
