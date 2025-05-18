'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function AppBar() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <div>Loading...</div>;

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => signIn("google")}
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.pair?.response || "No response");
    } catch (err) {
      setResponse("Error fetching response.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <div>Welcome, {session.user.name}</div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          required
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <strong>AI Response:</strong>
          <div>{response}</div>
        </div>
      )}
    </div>
  );
}