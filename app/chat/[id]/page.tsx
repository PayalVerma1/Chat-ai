"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { Loader2, Bot } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PaymentPage from "@/app/components/payments";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();
  const [copy, setCopy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState("groq");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [chat?.exchanges, sending]);

  useEffect(() => {
    if (!id) {
      router.push("/chat/new");
      return;
    }
    const fetchChat = async () => {
      setLoading(true);
      try {
        const chatId = Array.isArray(id) ? id[0] : id;
        const res = await axios.get(`/api/chat?id=${chatId}`);
        if (res.data.data) {
          addChat(res.data.data);
        } else {
          router.push("/chat/new");
        }
      } catch (error: any) {
        console.error("Error fetching chat:", error);
        router.push("/chat/new");
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [id, addChat, router]);

  const sendMessage = async (message: string) => {
    setSending(true);
    setInput("");
    try {
      const chatId = Array.isArray(id) ? id[0] : id;
      const res = await axios.post("/api/chat", {
        prompt: message,
        chatId: chatId,
        modelProvider: model,
      });
      addChat(res.data);
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        alert(
          error.response.data.error || "This model is for paid users only."
        );
      }
    } finally {
      setSending(false);
    }
  };
  
  const createCopy = async (textToCopy: string , i:number) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopy(i);
      setTimeout(() => setCopy(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendMessage(input);
  };

  // --- START RENDER ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden">
        <DotLottieReact
          src="https://lottie.host/embed/6df64044-5c5b-442b-b916-26392b4a7972/4QrMlLP3gw.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#F5FBEF] text-[#2E2E2E] dark:bg-[#252722] dark:text-white">
    
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 flex-1">
          {hasExchanges ? (
            <div className="flex flex-col space-y-6">
              {chat.exchanges
                .sort((a, b) => {
                  if (a.createdAt && b.createdAt) {
                    return (
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                    );
                  }
                  return Number(a.id) - Number(b.id);
                })
                .map((exchange,i) => (
                  <div key={exchange.id} className="flex flex-col space-y-4">
                    <div className="flex flex-col group items-end gap-2">
                      <div className="max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] ">
                        <div
                          className="rounded-2xl rounded-br-md px-4 py-3 shadow-sm relative"
                          style={{
                            backgroundColor: "#7CB342", 
                            color: "#1E1E1E",
                          }}
                        >
                          <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                            {exchange.prompt}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => createCopy(exchange.prompt,i*2)}
                        className="p-2 rounded-s opacity-0 group-hover:opacity-100 transition"
                        title="Copy message"
                      >
                        {copy===i*2 ? (
                          <Check className="w-4 h-4 text-[#1E1E1E] dark:text-white" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#1E1E1E] dark:text-white" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-2">
                      <div className="max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
                        <div className="bg-[#F0F0E9] dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#7CB342]/30 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-[#1E1E1E] dark:bg-[#7CB342] rounded-full flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white dark:text-[#1E1E1E]" />
                            </div>
                          </div>
                          <p className="text-sm sm:text-base text-[#1E1E1E] dark:text-white whitespace-pre-wrap break-words leading-relaxed">
                            {exchange.response}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => createCopy(exchange.response,i*2+1)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#7CB342]/20 transition mt-2"
                        title="Copy response"
                      >
                        {copy===i*2+1 ? (
                          <Check className="w-4 h-4 text-[#1E1E1E] dark:text-white" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#1E1E1E] dark:text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#7CB342]/30 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[#1E1E1E] dark:bg-[#7CB342] rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white dark:text-[#1E1E1E]" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          AI Assistant
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#7CB342]" />
                        <span className="text-sm text-[#1E1E1E] dark:text-white">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className="w-16 h-16 bg-[#1E1E1E] dark:bg-[#7CB342] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Bot className="w-8 h-8 text-white dark:text-[#1E1E1E]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E] dark:text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Ask me anything! I'm here to help with questions, creative
                writing, analysis, and more.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full backdrop-blur-2xl shadow-2xl px-4 py-4 bg-[#F5FBEF]/90 dark:bg-[#252722]/90">
        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-0" />
            <div className="relative w-full border-2 border-gray-200 dark:border-[#7CB342]/30 rounded-3xl bg-[#F0F0E9] dark:bg-[#1E1E1E] shadow-xl focus-within:shadow-2xl focus-within:border-[#7CB342]">
              <input
                type="text"
                placeholder={
                  loading ? "✨ Creating your chat..." : "What's on your mind?"
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
                        <span className="text-white font-bold text-xs">AI</span>
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
                        <span className="text-white font-bold text-xs">C</span>
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
                  {loading || sending ? (
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
  );
}
