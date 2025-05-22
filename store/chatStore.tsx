import { create } from 'zustand';
import {Chat,Pair} from "@prisma/client"
import { persist } from 'zustand/middleware';
export type Fullchat=Chat & {
    exchanges:Pair[]
}
interface ChatStore {
    //chat is a object of type FullChat
    chat:Fullchat|null;
    //chats is the array of type FullChat and chat is a array of pair 
    addChat: (chats: Fullchat) => void;
    clearChat: () => void;
}

export const useChatStore=create<ChatStore>()(
    persist(
       (set)=>({
        chat:null,
        //chat:data.data passed chat/[id]
        addChat: (chats: Fullchat) => set(() => ({ chat: chats })),
        clearChat: () => set(() => ({ chat: null })),
       }),
       {
        name: "Chat Store"
       }
    )
)