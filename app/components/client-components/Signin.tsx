
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  return session?.user ? (
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
  );
}
