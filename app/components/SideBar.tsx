"use client";
import { useChatStore } from "@/store/chatStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "./AppBar";

type SideBarProps = {
  className?: string;
};

export default function SideBar({ className = "" }: SideBarProps) {
  const { chats, setChats } = useChatStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={` ${className}`}>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-gray-800 p-2 text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          )}
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex min-h-screen max-h-screen flex-col bg-gray-900 text-gray-200 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64
          ${
            isMobileMenuOpen
              ? "w-full translate-x-0"
              : "w-64 -translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="flex items-center justify-between p-5 pb-0 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-50">Chat-Ai</h2>

          <button
            onClick={closeMobileMenu}
            className="md:hidden rounded-lg p-1 text-gray-400 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
          <ul className="space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/chat/${chat.id}`}
                    onClick={closeMobileMenu}
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

        <div className="border-t border-gray-800 p-4 flex-shrink-0">
          <AppBar />
        </div>
      </div>
    </div>
  );
}
