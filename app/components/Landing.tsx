
"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/chat/new");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F3FC] dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3FC] dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          Chat-AI
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your AI-powered conversation companion
        </p>
        
        <button
          onClick={() => signIn()}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Sign In to Continue
        </button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Sign in to start your AI conversation journey
        </p>
      </div>
    </div>
  );
}