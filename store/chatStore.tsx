import { create } from 'zustand';
import {Chat} from "@prisma/client"
import { persist } from 'zustand/middleware';
interface ChatStore {
    //chat is a object of type Chat
    chat:Chat|null;
    addChat: (chats: Chat) => void;
    clearChat: () => void;
}

export const useChatStore=create<ChatStore>()(
    persist(
       (set)=>({
        chat:null,
        addChat:(chats: Chat) =>set(()=>({chat:chats})),
         clearChat: () => set(()=>({chat:null})),
       }),
       {
        name:"Chat Store"
       }
    )
)