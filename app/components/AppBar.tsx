'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function AppBar() {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-xl font-bold">Chat-ai</div>
      <div>
        {session?.user ? (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => signIn("google")}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}