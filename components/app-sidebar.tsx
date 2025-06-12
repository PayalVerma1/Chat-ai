"use client";

import { useChatStore } from "@/store/chatStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import AppBar from "@/app/components/AppBar";
import PaymentPage from "@/app/components/payments";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-semibold px-4 pb-3 pt-4  text-gray-50">
            Chat-Ai
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <div className="px-3 pt-2">
              <button
                onClick={handleNewChat}
                className="group flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-300 group-hover:text-gray-200"
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

            <SidebarMenu className="mt-4 px-3">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/chat/${chat.id}`}
                        className={`block w-full truncate rounded-lg p-2 text-sm text-left transition-colors ${
                          pathname === `/chat/${chat.id}`
                            ? "bg-gray-700 font-medium text-gray-50"
                            : "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                        }`}
                        title={`Chat ${chat.id}`}
                      >
                        {`Chat ${chat.id.slice(0, 8)}...`}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="px-2 py-4 text-center text-sm text-gray-500">
                  No chats yet. Start a new one!
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
 
        <div className="border-t border-gray-800 p-3 mt-auto">
          <AppBar />
           <PaymentPage />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
