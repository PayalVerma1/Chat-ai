"use client";
import { useChatStore } from "@/store/chatStore";
import { useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
export default function InputBox(){
    const { id } = useParams();
      const [input, setInput] = useState("");
      const { chat, addChat, clearChat } = useChatStore();
    const addPrompt = async (newPrompt: string) => {
    try {
      //when user submits a new prompt then a new chat is created because i forgot to add refernce for id because of which it was creating a new chat every time
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
      <div className="flex  ">
        <input
          type="text"
          placeholder="Type something here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full "
        />
        <button type="submit" className="bg-red-500 p-2 text-white">Send</button>
        </div>
      </form>
  )
}
