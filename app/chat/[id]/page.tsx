"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/chat/new');
      return;
    }
    
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/api/chat?id=${id}`);
        if (res.data.data) {
          addChat(res.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching chat:", error);
        if (error.response?.status === 404) {
          router.push('/chat/new');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchChat();
  }, [id, addChat, router]);
  

  const sendMessage = async (message: string) => {
    setSending(true);
    try {
      const res = await axios.post("/api/chat", {
        prompt: message,
        chatId: Array.isArray(id) ? id[0] : id,
      });
      
      const updatedChat = res.data;
      addChat(updatedChat);
      setInput("");
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
  const deleteMessage=async()=>{
    if (!id) return;
    try {
      await axios.delete(`/api/chat?id=${id}`);
      router.push('/chat/new');
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Chat</h1>
         <button
    onClick={deleteMessage}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  >
    Delete Chat
  </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat && chat.exchanges && chat.exchanges.length > 0 ? (
          chat.exchanges.map((exchange) => (
            <div key={exchange.id} className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl bg-blue-500 text-white p-3 rounded-lg shadow">
                  <div className="font-semibold text-sm mb-1">You</div>
                  <div className="whitespace-pre-wrap">{exchange.prompt}</div>
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl bg-white border p-3 rounded-lg shadow">
                  <div className="font-semibold text-sm mb-1 text-gray-700">AI Assistant</div>
                  <div className="whitespace-pre-wrap text-gray-800">{exchange.response}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-lg mb-2">No messages yet</div>
              <div>Start the conversation below!</div>
            </div>
          </div>
        )}
        
        {/* Sending indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-xs bg-gray-200 p-3 rounded-lg">
              <div className="font-semibold text-sm mb-1 text-gray-700">AI Assistant</div>
              <div className="flex items-center space-x-1">
                <div className="animate-pulse">Thinking...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}