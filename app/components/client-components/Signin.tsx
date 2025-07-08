"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import UserDropdown from "@/components/userDropdown";
export default function SignIn({ className }: { className?: string }) {
  const { data: session } = useSession();

  return session?.user ? (
    <UserDropdown />
  ) : (
    <button
      className="px-4 py-2 text-gray-700 dark:text-white rounded ${className || ''}"
      onClick={() => signIn("google")}
    >
      SIGN IN
    </button>
  );
}
