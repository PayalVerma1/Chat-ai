"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { SendHorizonal, Trash2, Loader2, Bot, User } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import PaymentPage from "@/app/components/payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState("groq"); // ✅ Model state
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
        modelProvider: model, // ✅ Send selected model
      });
      addChat(res.data);
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
      <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-white">Chat-AI</h1>
        <button
          onClick={deleteChatConfirm}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
          <span className="text-sm font-medium">Delete Chat</span>
        </button>
      </div>
      {/* Chat Messages - Only this section scrolls */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar">
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
                      <p className="text-sm whitespace-pre-wrap break-words">{exchange.prompt}</p>
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
                      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
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

      {/* Fixed Input Section */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-shrink-0 border border-gray-300 rounded px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200">
              {model.toUpperCase()}
            </DropdownMenuTrigger>
           <DropdownMenuContent>
                           <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
                           <DropdownMenuSeparator />
           
                           <DropdownMenuItem onClick={() => setModel("groq")}>
                             Groq (Free)
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setModel("gemini")}>
                             Gemini
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setModel("openai")}>
                             OpenAI
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setModel("claude")}>
                             Claude
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuLabel className="text-xs text-gray-500 px-2">
                             Upgrade to use premium models
                           </DropdownMenuLabel>
           
                           <div className="px-3 py-2">
                             <PaymentPage />
                           </div>
                         </DropdownMenuContent>
          </DropdownMenu>

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
            className="flex-1 resize-none p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex-shrink-0 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
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