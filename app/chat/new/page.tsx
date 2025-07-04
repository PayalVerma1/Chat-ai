"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SendHorizonal, Bot, User } from "lucide-react";
import PaymentPage from "@/app/components/payments";
import ModeToggle from "@/app/components/modeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
const ChatSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex justify-end">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="bg-blue-600 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-48 bg-blue-500" />
            <Skeleton className="h-4 w-32 bg-blue-500" />
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-30 w-64" />
            <Skeleton className="h-30 w-52" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="bg-blue-600 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-36 bg-blue-500" />
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewChatPage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("groq");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const createNewChat = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/chat", {
        prompt: prompt,
        modelProvider: model,
      });
      // No chatId here -because it creates a new chat and all the other prompt get its id otherwise if chatId is provided it will create new chat for every prompt
      const newChat = res.data;
      console.log("New chat created:", newChat);
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        alert(
          error.response.data.error || "This model is for paid users only."
        );
      }
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    createNewChat(input);
  };

  return (
    <div className="relative flex-1">
      <div className="flex flex-col h-full w-full bg-[#F8F3FC] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 2xl:px-60">
            <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-black mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Chat-AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              Start a new conversation to explore ideas and get answers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "Explain quantum computing in simple terms",
                "Suggest a few fun activities for a family weekend",
                "Write a short poem about a rainy day",
                "What's the difference between UI and UX?",
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {prompt}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Click to use as your first message.
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 w-full dark:from-gray-950/98 dark:via-gray-900/95 dark:to-gray-900/85 backdrop-blur-2xl dark:border-gray-700/80 shadow-2xl px-4 py-4 ">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-3xl blur-xl pointer-events-none" />
              <div className="relative w-full border-2 border-gray-200 dark:border-gray-600/70 rounded-3xl bg-white/90 dark:bg-gray-800/90 shadow-xl focus-within:shadow-2xl">
                <input
                  type="text"
                  placeholder={
                    loading
                      ? "✨ Creating your chat..."
                      : "What's on your mind?"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full pl-6 pr-6 pt-4 pb-12 rounded-3xl bg-transparent text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium focus:outline-none"
                />

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-5 py-2 border-2 border-gray-200 dark:border-gray-600/70 rounded-2xl bg-white dark:bg-gray-800/90 text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-blue-400 dark:hover:border-blue-400/80 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 font-semibold text-sm min-w-[100px] group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">
                          {model.toUpperCase()}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-gray-600 dark:text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-white/98 dark:bg-gray-800/95 backdrop-blur-2xl border-2 border-gray-200/80 dark:border-gray-600/70 rounded-2xl shadow-2xl dark:shadow-gray-900/80 p-2">
                      <DropdownMenuLabel className="font-bold text-gray-900 dark:text-gray-50 text-base px-3 py-2">
                        🤖 Select AI Model
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600/80 to-transparent my-2" />

                      <DropdownMenuItem
                        onClick={() => setModel("groq")}
                        className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-lg flex items-center justify-center shadow-md dark:shadow-emerald-900/50">
                            <span className="text-white font-bold text-xs">
                              G
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            Groq
                          </span>
                        </div>
                        <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 text-white px-3 py-1 rounded-full font-bold shadow-md">
                          FREE
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("gemini")}
                        className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-md dark:shadow-emerald-900/50">
                            <span className="text-white font-bold text-xs">
                              G
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            Gemini
                          </span>
                        </div>
                        <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 text-white px-3 py-1 rounded-full font-bold shadow-md">
                          FREE
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("openai")}
                        className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-lg flex items-center justify-center shadow-md dark:shadow-purple-900/50">
                          <span className="text-white font-bold text-xs">
                            AI
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          OpenAI
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("claude")}
                        className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-400 rounded-lg flex items-center justify-center shadow-md dark:shadow-red-900/50">
                          <span className="text-white font-bold text-xs">
                            C
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          Claude
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600/80 to-transparent my-3" />
                      <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-600/50">
                        <DropdownMenuLabel className="text-xs text-gray-700 dark:text-gray-200 font-medium mb-2 flex items-center gap-1">
                          ✨ Premium Models Available
                        </DropdownMenuLabel>
                        <PaymentPage />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label={loading ? "Creating chat" : "Start chat"}
                    className="p-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-500 dark:via-purple-500 dark:to-blue-600 text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {loading && (
              <div className="absolute top-2 right-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-pulse border border-blue-300 dark:border-blue-500/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <span>Preparing your chat...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
