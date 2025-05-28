"use client";
import { useChatStore } from "@/store/chatStore";
import { useParams } from "next/navigation";
import { use, useState } from "react";
import axios from "axios";
export default function InputBox(){
    const { id } = useParams();
      const [input, setInput] = useState("");
      const { chat, addChat, clearChat } = useChatStore();
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
  return(
     <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type something here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit">Send</button>
      </form>
  )
}
