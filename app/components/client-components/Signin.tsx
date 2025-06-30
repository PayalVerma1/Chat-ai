
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import UserDropdown from "@/components/userDropdown";
export default function SignIn() {
  const { data: session } = useSession();

  return session?.user ? (
    <UserDropdown />
  ) : (
    <button
      className="px-4 py-2  text-white rounded"
      onClick={() => signIn("google")}
    >
      Sign In
    </button>
  );
}
