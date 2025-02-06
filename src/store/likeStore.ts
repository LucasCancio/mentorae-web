import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikeState {
  alreadyLikedByMentoringId: {
    [key: number]: boolean;
  };
  like: (mentoringId: number) => void;
  unLike: (mentoringId: number) => void;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set) => ({
      alreadyLikedByMentoringId: {},
      like(mentoringId) {
        set((state) => {
          return {
            alreadyLikedByMentoringId: {
              ...state.alreadyLikedByMentoringId,
              [mentoringId]: true,
            },
          };
        });
      },
      unLike(mentoringId) {
        set((state) => {
          delete state.alreadyLikedByMentoringId[mentoringId];
          return state;
        });
      },
    }),
    {
      name: "@mentorae-storage",
    }
  )
);

//set({ token });
