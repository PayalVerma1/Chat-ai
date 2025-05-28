"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
export default function ChatPage() {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const { chat, addChat, clearChat } = useChatStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/api/chat?id=${id}`);
        const data = res.data;
        if (data.data) {
          addChat(data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  },[id]);
  const addPrompt = async (newPrompt: string) => {
    try {
      const res = await axios.post("/api/chat", {
        prompt: newPrompt,
        chatId: id,
      });
      const updatedChat = res.data;
      addChat(updatedChat);
      setInput("");
    } catch (error) {
      console.log("Error sending prompt:", error);
    }
  };
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addPrompt(input);
  };
  
  if (loading) return <div>Loading...</div>;
  return (
     <div>
     
      {chat && chat.exchanges.map((pair) => (
        <div key={pair.id}>
          <p><strong>You:</strong> {pair.prompt}</p>
          <p><strong>AI:</strong> {pair.response}</p>
        </div>
      ))}
     <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Type something here..." value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 w-full" />
    <button type="submit">Send</button>
     </form>
    </div>
  );
}
