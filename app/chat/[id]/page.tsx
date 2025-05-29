"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";

export default function ChatPage() {
  const { id } = useParams();
  const { chat, addChat, clearChat } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
//   This runs every time the id changes (or when the page loads).
// It fetches the chat data for the current chat ID from your backend.
// If chat data is found, it adds it to your store.
// Handles errors and stops loading when don

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
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
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
      <div className="m-2 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
             id={id as string}
              type="text"
              placeholder="Type something here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-red-500 p-2 text-white">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
