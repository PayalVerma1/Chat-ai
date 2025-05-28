"use client";
import { useChatStore } from "@/store/chatStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
export default function SideBar() {
  const { chats , setChats} = useChatStore();
  const pathname = usePathname(); 
  useEffect(()=>{
  const fetchChats=async ()=>{
    try{
      const res=await axios.get("/api/chat");
      setChats(res.data.chats);
    }catch(err){
      console.log("Error fetching chats:", err);
    }
  }
  fetchChats();
},[]);

  return (
    <div className="w-64 bg-gray-200 p-4 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
      <ul className="space-y-2">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat.id}>
              <Link
                href={`/chat/${chat.id}`}
                className={`block p-2 rounded hover:bg-gray-300 ${
                  pathname === `/chat/${chat.id}` ? "bg-gray-300 font-semibold" : ""
                }`}
              >
                {`Chat ${chat.id.slice(0, 4)}...`}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-600">No chats yet.</p>
        )}
      </ul>
    </div>
  );
}
