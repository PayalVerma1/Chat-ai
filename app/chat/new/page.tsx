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
          <div className="bg-[#7CB342] rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-48 bg-[#7CB342]/70" />
            <Skeleton className="h-4 w-32 bg-[#7CB342]/70" />
          </div>
          <div className="w-8 h-8 bg-[#7CB342] rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-[#1E1E1E]" />
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="w-8 h-8 bg-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 space-y-2 border border-[#CBD5D1] dark:border-[#7CB342]/30">
            <Skeleton className="h-30 w-64" />
            <Skeleton className="h-30 w-52" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="bg-[#7CB342] rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-36 bg-[#7CB342]/70" />
          </div>
          <div className="w-8 h-8 bg-[#7CB342] rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-[#1E1E1E]" />
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="w-8 h-8 bg-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 space-y-2 border border-[#CBD5D1] dark:border-[#7CB342]/30">
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
      // No chatId here - because it creates a new chat and all the other prompt get its id
      // otherwise if chatId is provided it will create new chat for every prompt
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
      <div className="flex flex-col h-full w-full bg-[#F5F7F6] dark:bg-[#252722] text-[#2E2E2E] dark:text-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 2xl:px-60">
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-4 text-[#7CB342] leading-tight">
              Hey, How can I help you?
            </h1>

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
                  className="bg-[#F5FBEF] dark:bg-[#1E1E1E] border border-[#CBD5D1] dark:border-[#7CB342]/30 rounded-lg p-4 text-left shadow-sm hover:shadow-md hover:bg-[#E9F0E8] dark:hover:bg-[#7CB342]/20 dark:hover:border-[#7CB342] transition-all duration-200"
                >
                  <p className="font-semibold text-[#2E2E2E] dark:text-white">
                    {prompt}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Click to use as your first message.
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 w-full backdrop-blur-2xl  shadow-2xl px-4 py-4 bg-[#F5F7F6] dark:bg-[#252722]/90">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div
                className="absolute inset-0"
              />
              <div className="relative w-full border-2 border-gray-200 dark:border-[#7CB342]/30 rounded-3xl bg-[#F0F0E9] dark:bg-[#1E1E1E] shadow-xl focus-within:shadow-2xl focus-within:border-[#7CB342]">
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
                  className="w-full pl-6 pr-6 pt-4 pb-12 rounded-3xl bg-transparent text-[#1E1E1E] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium focus:outline-none"
                />

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-5 py-2 border-2 border-gray-200 dark:border-[#7CB342]/30 rounded-2xl bg-[#F5FBEF] dark:bg-[#252722] text-[#252722] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1E1E1E]/80 hover:border-[#7CB342] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm min-w-[100px] group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#7CB342]">
                          {model.toUpperCase()}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-[#252722] dark:text-white"
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
                    <DropdownMenuContent className="w-64 bg-white dark:bg-[#252722] backdrop-blur-2xl border-2 border-gray-200 dark:border-[#7CB342]/30 rounded-2xl shadow-2xl p-2">
                      <DropdownMenuLabel className="font-bold text-[#252722] dark:text-white text-base px-3 py-2">
                        🤖 Select AI Model
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="h-px bg-gray-300 dark:bg-[#7CB342]/30 my-2" />

                      <DropdownMenuItem
                        onClick={() => setModel("groq")}
                        className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-[#7CB342]/10 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#7CB342] rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-[#252722] font-bold text-xs">
                              G
                            </span>
                          </div>
                          <span className="font-medium text-[#252722] dark:text-white">
                            Groq
                          </span>
                        </div>
                        <span className="text-xs bg-[#7CB342] text-[#252722] px-3 py-1 rounded-full font-bold shadow-md">
                          FREE
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("gemini")}
                        className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-[#7CB342]/10 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#252722] rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xs">
                              G
                            </span>
                          </div>
                          <span className="font-medium text-[#252722] dark:text-white">
                            Gemini
                          </span>
                        </div>
                        <span className="text-xs bg-[#7CB342] text-[#252722] px-3 py-1 rounded-full font-bold shadow-md">
                          FREE
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("openai")}
                        className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-[#7CB342]/10 rounded-xl transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-[#252722] rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-xs">
                            AI
                          </span>
                        </div>
                        <span className="font-medium text-[#252722] dark:text-white">
                          OpenAI
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setModel("claude")}
                        className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-[#7CB342]/10 rounded-xl transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-[#252722] rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-xs">
                            C
                          </span>
                        </div>
                        <span className="font-medium text-[#252722] dark:text-white">
                          Claude
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="h-px bg-gray-300 dark:bg-[#7CB342]/30 my-3" />
                      <div className="px-3 py-2 bg-[#7CB342]/10 rounded-xl border border-[#7CB342]/20">
                        <DropdownMenuLabel className="text-xs text-[#252722] dark:text-white font-medium mb-2 flex items-center gap-1">
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
                    className="p-2 rounded-full bg-[#7CB342] text-[#252722] hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#252722]/30 border-t-[#252722] rounded-full animate-spin" />
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
              <div className="absolute top-2 right-6 bg-[#7CB342] text-[#252722] px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-pulse border border-[#7CB342]/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#252722] rounded-full animate-bounce" />
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
