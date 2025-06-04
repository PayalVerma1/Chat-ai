"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { SendHorizonal, Trash2, Loader2, Bot, User } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, sending, loading]);

  useEffect(() => {
    if (!id) {
      router.push("/chat/new");
      return;
    }

    const fetchChat = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/chat?id=${id}`);
        if (res.data.data) {
          addChat(res.data.data);
        } else {
          router.push("/chat/new");
        }
      } catch (error: any) {
        console.error("Error fetching chat:", error);
        if (error.response?.status === 404) {
          router.push("/chat/new");
        }
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
      const res = await axios.post("/api/chat", {
        prompt: message,
        chatId: Array.isArray(id) ? id[0] : id,
      });

      const updatedChat = res.data;
      addChat(updatedChat);
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendMessage(input);
  };

  const deleteChatConfirm = async () => {
    if (!id) return;
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await axios.delete(`/api/chat?id=${id}`);
      router.push("/chat/new");
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-500 mb-4" />
        <div className="text-lg sm:text-xl font-medium text-center">
          Loading chat...
        </div>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center p-3 sm:p-4 lg:px-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
            Chat with AI
          </h1>
          <button
            onClick={deleteChatConfirm}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-colors flex-shrink-0"
            aria-label="Delete Chat"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Delete</span>
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-none">
          {hasExchanges ? (
            <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
              <div className="max-w-4xl mx-auto w-full">
                {chat.exchanges.map((exchange) => (
                  <div
                    key={exchange.id}
                    className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
                  >
                    <div className="flex items-start justify-end gap-2 sm:gap-3">
                      <div className="bg-blue-600 text-white p-2 sm:p-3 rounded-lg shadow-md max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] break-words">
                        <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                          {exchange.prompt}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    <div className="flex items-start justify-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 sm:p-3 rounded-lg shadow-md max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] break-words">
                        <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                          {exchange.response}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex items-start justify-start gap-2 sm:gap-3 mb-6">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg shadow-md">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        <span className="text-sm sm:text-base">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                <Bot className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-blue-400 dark:text-blue-500" />
                <div className="text-xl sm:text-2xl font-semibold mb-2">
                  No messages yet
                </div>
                <p className="text-sm sm:text-base px-4">
                  Start the conversation by typing your first message below!
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 sm:gap-3"
            >
              <div className="flex-1 min-w-0">
                <TextareaAutosize
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    sending ? "AI is thinking..." : "Type your message here..."
                  }
                  maxRows={6}
                  minRows={1}
                  className="w-full resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label={sending ? "Sending message" : "Send message"}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
