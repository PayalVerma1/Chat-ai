"use client";
import { useChatStore } from "@/store/chatStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import AppBar from "@/app/components/AppBar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Trash2 } from "lucide-react";

export default function AppSidebar() {
  const { chats, setChats } = useChatStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/api/chat");
        setChats(res.data.chats);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [setChats]);

  const handleNewChat = async () => {
    router.push(`/chat/new`);
  };

  const deleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      await axios.delete(`/api/chat?id=${chatId}`);
      setChats(chats.filter((chat) => chat.id !== chatId));

      if (pathname === `/chat/${chatId}`) {
        router.push("/chat/new");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat.");
    }
  };

  return (
    <Sidebar className="h-screen flex flex-col">
      <SidebarContent className="h-full flex flex-col bg-[#F0F0E9] dark:bg-[#1F211C] overflow-hidden">
        <div className="flex-shrink-0">
          <SidebarGroupLabel className="text-2xl font-bold px-6 pb-4 pt-8 text-[#7CB342]">
            Chat-AI
          </SidebarGroupLabel>

          <div className="px-3 pt-2 pb-3">
            <button
              onClick={handleNewChat}
              className="group flex w-full items-center justify-center space-x-2 rounded-lg border border-[#CBD5D1] dark:border-[#9CEE69]/30 bg-[#7CB342] px-4 py-2 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-[#9CEE69]/90 hover:border-[#9CEE69] focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5 text-[#1E1E1E] font-bold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>New Chat</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <SidebarMenu className="space-y-1">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <SidebarMenuItem
                  key={chat.id}
                  className="group/item flex items-center justify-between"
                >
                  <SidebarMenuButton asChild className="flex-1 min-w-0">
                    <Link
                      href={`/chat/${chat.id}`}
                      className={`block w-full truncate rounded-lg p-2 text-sm text-left transition-colors ${
                        pathname === `/chat/${chat.id}`
  ? "font-medium border border-[#CBD5D1] dark:border-[#9CEE69]/30 bg-[#E9F0E8] text-[#1E1E1E] dark:bg-[#7CB342]/20 dark:text-[#9CEE69]"
  : "text-[#1E1E1E] hover:bg-[#E9F0E8] hover:text-[#1E1E1E] dark:text-[#CCCCCC] dark:hover:bg-[#7CB342]/20 dark:hover:text-[#9CEE69]"
}`}
                      title={`Chat ${chat.id}`}
                    >
                      {`Chat ${chat.id.slice(0, 8)}...`}
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-1 p-1 rounded hover:bg-[#E9F0E8] dark:hover:bg-[#7CB342]/20 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-[#1E1E1E] dark:text-white hover:text-[#7CB342]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-[#1E1E1E] border border-[#CBD5D1] dark:border-[#7CB342]/30 rounded-md shadow-lg">
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => deleteChat(chat.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            ) : (
              <p className="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No chats yet. Start a new one!
              </p>
            )}
          </SidebarMenu>
        </div>

        <div className="flex-shrink-0 border-t border-[#CBD5D1] dark:border-[#9CEE69]/30 p-1">
          <AppBar />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
