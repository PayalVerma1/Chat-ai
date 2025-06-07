"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SendHorizonal } from "lucide-react";

export default function NewChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createNewChat = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/chat", {
        prompt: prompt,
      });
      // No chatId here -because it creates a new chat and all the other prompt get its id otherwise if chatId is provided it will create new chat for every prompt
      const newChat = res.data;
      console.log("New chat created:", newChat);
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    createNewChat(input);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 2xl:px-60">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-200">
            Chat-Ai
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Start a new conversation to explore ideas and get answers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {[
              "Explain quantum computing in simple terms",
              "Suggest a few fun activities for a family weekend",
              "Write a short poem about a rainy day",
              "What's the difference between UI and UX?",
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {prompt}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click to use as your first message.
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={
                  loading ? "Creating chat..." : "Type your first message..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700"
                disabled={loading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={loading || !input.trim()}
                aria-label={loading ? "Creating chat" : "Start chat"}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full block"></span>
                ) : (
                  <SendHorizonal size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
