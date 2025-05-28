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
  }, [id]);
  
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {chat &&
        chat.exchanges.map((pair) => (
          <div key={pair.id} className="flex flex-col gap-4">
            <div className="flex justify-end">
              <p className="p-4 m-2 mr-12 border-2 rounded-2xl bg-blue-100 max-w-xs">
                <strong>You:</strong> {pair.prompt}
              </p>
            </div>
            <div className="flex justify-start">
              <p className="m-2 ml-12 p-4 border-2 rounded-2xl bg-amber-100 max-w-xs">
                <strong>AI:</strong> {pair.response}
              </p>
            </div>
          </div>
        ))}
     
    </div>
  );
}
