"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import axios from "axios";
import { SendHorizonal, Trash2, Loader2, Bot, User } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import PaymentPage from "@/app/components/payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModeToggle from "@/app/components/modeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { chat, addChat } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState("groq");
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
        router.push("/chat/new");
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
        modelProvider: model,
      });
      addChat(res.data);
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
      <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  const hasExchanges = chat && chat.exchanges && chat.exchanges.length > 0;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#F8F3FC] dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar">
        {hasExchanges ? (
          <div className="space-y-4">
            {chat.exchanges.map((exchange) => (
              <div key={exchange.id} className="w-full">
                <div className="flex justify-end">
                  <Card className="my-2 mr-10 sm:mr-2 bg-[#7C3AED] text-white rounded-lg max-w-[60%]">
                    <CardContent className="pt-0">
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {exchange.prompt}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-start">
                  <Card className="my-2 ml-10 sm:ml-2 bg-gray-100 rounded-lg max-w-[60%]">
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {exchange.response}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <Card className="my-2 bg-gray-100 rounded-lg max-w-[70%]">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Bot className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm font-medium">AI</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-800">Thinking...</span>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
            <p className="text-sm text-center">
              Start the conversation by typing your first message below!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

     <div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white/98 via-white/95 to-white/90 dark:from-gray-950/98 dark:via-gray-900/95 dark:to-gray-900/85 backdrop-blur-2xl border-t border-gray-200/60 dark:border-gray-700/80 shadow-2xl p-6">
     <div className="w-full px-4 sm:px-6">
       <form onSubmit={handleSubmit} className="flex items-end gap-4">
         <div className="flex flex-col gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger className="px-5 py-3 border-2 border-gray-200 dark:border-gray-600/70 rounded-2xl bg-white dark:bg-gray-800/90 text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-blue-400 dark:hover:border-blue-400/80 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 font-semibold text-sm min-w-[100px] group">
               <div className="flex items-center justify-between gap-2">
                 <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">
                   {model.toUpperCase()}
                 </span>
                 <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-64 bg-white/98 dark:bg-gray-800/95 backdrop-blur-2xl border-2 border-gray-200/80 dark:border-gray-600/70 rounded-2xl shadow-2xl dark:shadow-gray-900/80 p-2">
               <DropdownMenuLabel className="font-bold text-gray-900 dark:text-gray-50 text-base px-3 py-2">
                 🤖 Select AI Model
               </DropdownMenuLabel>
               <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600/80 to-transparent my-2" />
               
               <DropdownMenuItem 
                 onClick={() => setModel("groq")}
                 className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200 group"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-lg flex items-center justify-center shadow-md dark:shadow-emerald-900/50">
                     <span className="text-white font-bold text-xs">G</span>
                   </div>
                   <span className="font-medium text-gray-800 dark:text-gray-100">Groq</span>
                 </div>
                 <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 text-white px-3 py-1 rounded-full font-bold shadow-md">
                   FREE
                 </span>
               </DropdownMenuItem>
               
               <DropdownMenuItem 
                 onClick={() => setModel("gemini")}
                 className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200"
               >
                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-md dark:shadow-blue-900/50">
                   <span className="text-white font-bold text-xs">G</span>
                 </div>
                 <span className="font-medium text-gray-800 dark:text-gray-100">Gemini</span>
               </DropdownMenuItem>
               
               <DropdownMenuItem 
                 onClick={() => setModel("openai")}
                 className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200"
               >
                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-lg flex items-center justify-center shadow-md dark:shadow-purple-900/50">
                   <span className="text-white font-bold text-xs">AI</span>
                 </div>
                 <span className="font-medium text-gray-800 dark:text-gray-100">OpenAI</span>
               </DropdownMenuItem>
               
               <DropdownMenuItem 
                 onClick={() => setModel("claude")}
                 className="flex items-center gap-3 py-3 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 rounded-xl transition-all duration-200"
               >
                 <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-400 rounded-lg flex items-center justify-center shadow-md dark:shadow-red-900/50">
                   <span className="text-white font-bold text-xs">C</span>
                 </div>
                 <span className="font-medium text-gray-800 dark:text-gray-100">Claude</span>
               </DropdownMenuItem>
               
               <DropdownMenuSeparator className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600/80 to-transparent my-3" />
               <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-600/50">
                 <DropdownMenuLabel className="text-xs text-gray-700 dark:text-gray-200 font-medium mb-2 flex items-center gap-1">
                   ✨ Premium Models Available
                 </DropdownMenuLabel>
                 <PaymentPage />
               </div>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
         
         <div className="relative flex-grow">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/30 dark:to-purple-400/30 rounded-3xl blur-xl"></div>
           <div className="relative">
             <input
               type="text"
               placeholder={
                 loading ? "✨ Creating your chat..." : "What's on your mind?"
               }
               value={input}
               onChange={(e) => setInput(e.target.value)}
               className="w-full pl-6 pr-16 py-4 rounded-3xl border-2 border-gray-200 dark:border-gray-600/70 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-300 dark:hover:border-blue-400/80 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-300 disabled:bg-gray-50/95 dark:disabled:bg-gray-800/50 disabled:text-gray-400 dark:disabled:text-gray-400 shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 text-base font-medium"
               disabled={loading}
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
               {input.trim() && !loading && (
                 <div className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/80 px-2 py-1 rounded-full font-medium border border-gray-200 dark:border-gray-600/50">
                   {input.length}
                 </div>
               )}
               <button
                 type="submit"
                 className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-500 dark:via-purple-500 dark:to-blue-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 dark:hover:from-blue-400 dark:hover:via-purple-400 dark:hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/40 dark:focus:ring-blue-400/60 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:via-gray-700 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-blue-900/50 transform hover:scale-110 active:scale-95 relative overflow-hidden group"
                 disabled={loading || !input.trim()}
                 aria-label={loading ? "Creating chat" : "Start chat"}
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="relative">
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                     </svg>
                   )}
                 </div>
               </button>
             </div>
           </div>
         </div>
       </form>
    
       {loading && (
         <div className="absolute top-2 right-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg dark:shadow-blue-900/50 animate-pulse border border-blue-300 dark:border-blue-500/50">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
             <span>Preparing your chat...</span>
           </div>
         </div>
       )}
     </div>
    </div>
    </div>
  );
}
