"use client";
import { useChatStore } from "@/store/chatStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import AppBar from "./AppBar";

export default function SideBar() {
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
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-gray-200">
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-xl font-semibold  text-gray-50">Chat-Ai</h2>
      </div>
      <div className="p-4">
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

      <div className="flex-grow overflow-y-auto px-4 pb-4">
        <ul className="space-y-2">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <li key={chat.id}>
                <Link
                  href={`/chat/${chat.id}`}
                  className={`block truncate rounded-lg p-2 text-sm transition-colors ${
                    pathname === `/chat/${chat.id}`
                      ? "bg-gray-700 font-medium text-gray-50"
                      : "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                  }`}
                  title={`Chat ${chat.id}`}
                >
                  {`Chat ${chat.id.slice(0, 8)}...`}
                </Link>
              </li>
            ))
          ) : (
            <p className="px-2 py-4 text-center text-sm text-gray-500">
              No chats yet. Start a new one!
            </p>
          )}
        </ul>
      </div>

      <div className="border-t border-gray-800 p-4">
        <AppBar />
      </div>
    </div>
  );
}
