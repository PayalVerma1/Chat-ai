import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const groq = new Groq({
  apiKey: process.env.API_KEY!,
});

// GET: Fetch a chat and its prompt-response pairs
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "No id provided" }, { status: 400 });
    }

    const chat = await prismaClient.chat.findUnique({
      where: { id },
      include: {
        exchanges: true, // includes the prompt-response pairs
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "No chat found" }, { status: 404 });
    }

    return NextResponse.json({ data: chat }, { status: 200 });
  } catch (error) {
    console.error("GET Chat Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a chat and save prompt-response pair
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = response.choices[0].message.content ?? "";

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await prismaClient.chat.create({
      data: {
        userId: user.id,
      },
    });

    const pair = await prismaClient.pair.create({
      data: {
        chatId: chat.id,
        prompt,
        response: aiResponse,
      },
    });

    return NextResponse.json({ chat, pair }, { status: 200 });
  } catch (error) {
    console.error("POST Chat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
