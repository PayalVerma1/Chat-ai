"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
export default function ChatPage() {
  const { id } = useParams();
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
  if (loading) return <div>Loading...</div>;
  return (
     <div>
      <h1>Chat Page</h1>
      {chat && chat.exchanges.map((pair) => (
        <div key={pair.id}>
          <p><strong>You:</strong> {pair.prompt}</p>
          <p><strong>AI:</strong> {pair.response}</p>
        </div>
      ))}
    </div>
  );
}
