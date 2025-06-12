"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { SendHorizonal, Trash2, Loader2, Bot, User } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [chat, sending, loading]);

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
        if (error.response?.status === 404) {
          router.push("/chat/new");
        } else {
          alert("Failed to load chat. Please try again.");
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
      const chatId = Array.isArray(id) ? id[0] : id;
      const res = await axios.post("/api/chat", {
        prompt: message,
        chatId: chatId,
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
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const chatId = Array.isArray(id) ? id[0] : id;
      await axios.delete(`/api/chat?id=${chatId}`);
      router.push("/chat/new");
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className=" text-gray-600">Loading chat...</p>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-white">Chat with AI</h1>
        <button
          onClick={deleteChatConfirm}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
          <span className="text-sm font-medium">Delete Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {hasExchanges ? (
          <div className="space-y-4">
            {chat.exchanges.map((exchange) => (
              <div key={exchange.id} className="w-full">
                <div className="flex justify-end">
                  <Card className="my-2 bg-blue-500 text-white rounded-lg max-w-[70%]">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <User className="h-4 w-4" />
                      <CardTitle className="text-sm font-medium">You</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">{exchange.prompt}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-start">
                  <Card className="my-2 bg-gray-100 rounded-lg max-w-[70%]">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <CardTitle className="text-sm font-medium">AI</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-800">
                        {exchange.response}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <Card className="my-2 bg-gray-100 rounded-lg max-w-[70%]">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Bot className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm font-medium">AI</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-800">Thinking...</span>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
            <p className="text-sm text-center">
              Start the conversation by typing your first message below!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              sending ? "AI is thinking..." : "Type your message here..."
            }
            maxRows={6}
            minRows={1}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 resize-none p-3 border border-gray-300 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
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
  );
}
