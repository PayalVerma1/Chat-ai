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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-screen overflow-x-hidden">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <div className="text-xl font-medium">Loading chat...</div>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-screen w-6xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Chat with AI
        </h1>
        <button
          onClick={deleteChatConfirm}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          aria-label="Delete Chat"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar w-full">
        {hasExchanges ? (
          <div className="space-y-6 w-full">
            {chat.exchanges.map((exchange) => (
              <div key={exchange.id}>
                <div className="flex items-start justify-end space-x-3 mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg shadow-md max-w-[calc(100%-48px)]">
                    <p className="whitespace-pre-wrap text-base">
                      {exchange.prompt}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-start justify-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-md max-w-[calc(100%-48px)]">
                    <p className="whitespace-pre-wrap text-base">
                      {exchange.response}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-start justify-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md max-w-[calc(100%-48px)]">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full max-w-xl mx-auto">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Bot className="h-16 w-16 mx-auto mb-4 text-blue-400 dark:text-blue-500" />
              <div className="text-2xl font-semibold mb-2">No messages yet</div>
              <p className="text-md">
                Start the conversation by typing your first message below!
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg p-4 border-t border-gray-200 dark:border-gray-700">
        <div className=" mx-auto px-2 sm:px-0">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                sending ? "AI is thinking..." : "Type your message here..."
              }
              maxRows={8}
              minRows={1}
              className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-hidden disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
              disabled={sending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex-shrink-0 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label={sending ? "Sending message" : "Send message"}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
