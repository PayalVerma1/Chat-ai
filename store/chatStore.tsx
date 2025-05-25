import { create } from 'zustand';
import { Chat, Pair } from "@prisma/client";
import { persist } from 'zustand/middleware';

export type Fullchat = Chat & {
  exchanges: Pair[];
};

interface ChatStore {
  chat: Fullchat | null;
  chats: Fullchat[]; 
  addChat: (chat: Fullchat) => void;
  setChats: (chats: Fullchat[]) => void;
  clearChat: () => void;
  addPair: (pair: Pair) => void;
  clearPair: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chat: null,
      chats: [],
      addChat: (chat: Fullchat) =>
        set((state) => ({
          chat,
          chats: state.chats.some((c) => c.id === chat.id)
            ? state.chats
            : [...state.chats, chat],
        })),
      setChats: (chats: Fullchat[]) => set(() => ({ chats })), 
      clearChat: () => set(() => ({ chat: null })),
      addPair: (pair: Pair) =>
        set((state) =>
          state.chat
            ? {
                chat: {
                  ...state.chat,
                  exchanges: [...state.chat.exchanges, pair],
                },
                chats: state.chats.map((c) =>
                  c.id === state.chat!.id
                    ? {
                        ...c,
                        exchanges: [...c.exchanges, pair],
                      }
                    : c
                ),
              }
            : state
        ),
      clearPair: () =>
        set((state) =>
          state.chat
            ? {
                chat: { ...state.chat, exchanges: [] },
                chats: state.chats.map((c) =>
                  c.id === state.chat!.id
                    ? { ...c, exchanges: [] }
                    : c
                ),
              }
            : state
        ),
    }),
    {
      name: "Chat Store",
    }
  )
);