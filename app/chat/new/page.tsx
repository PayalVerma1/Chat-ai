"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createNewChat = async (prompt: string) => {
    setLoading(true);
    try {
      // Don't pass chatId - this will create a new chat
      const res = await axios.post("/api/chat", {
        prompt: prompt,
        // No chatId here - creates new chat
      });
      
      const newChat = res.data;
      console.log("New chat created:", newChat);
      
      // Redirect to the new chat page with the created chat ID
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.log("Error creating new chat:", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    createNewChat(input);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Start a New Chat</h1>
          <p className="text-gray-600 mb-8">What would you like to talk about?</p>
        </div>
      </div>
      
      <div className="m-2 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
              type="text"
              placeholder="Type your first message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 w-full"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="bg-blue-500 p-2 text-white disabled:bg-gray-400"
              disabled={loading || !input.trim()}
            >
              {loading ? "Creating..." : "Start Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}