"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { SendHorizonal, Trash2, Loader2, Bot, User } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

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
      <div>
        <Loader2 />
        <p>Loading chat...</p>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div>
      <div>
        <h1>Chat with AI</h1>
        <button onClick={deleteChatConfirm}>
          <Trash2 />
          <span>Delete Chat</span>
        </button>
      </div>

      <div>
        {hasExchanges ? (
          <div>
            {chat.exchanges.map((exchange) => (
              <div key={exchange.id}>
                <div>
                  <p>{exchange.prompt}</p>
                  <User />
                </div>
                <div>
                  <Bot />
                  <p>{exchange.response}</p>
                </div>
              </div>
            ))}
            {sending && (
              <div>
                <Bot />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Bot />
            <h2>No messages yet</h2>
            <p>Start the conversation by typing your first message below!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sending ? "AI is thinking..." : "Type your message here..."}
            maxRows={6}
            minRows={1}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button type="submit" disabled={!input.trim() || sending}>
            {sending ? <Loader2 /> : <SendHorizonal />}
          </button>
        </form>
      </div>
    </div>
  );
}
