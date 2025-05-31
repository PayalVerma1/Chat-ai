import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const groq = new Groq({
  apiKey: process.env.API_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const chat = await prismaClient.chat.findUnique({
        where: { id },
        include: {
          exchanges: true,
        },
      });

      if (!chat) {
        return NextResponse.json({ message: "No chat found" }, { status: 404 });
      }

      return NextResponse.json({ data: chat }, { status: 200 });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      include: {
        chats: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ chats: user?.chats ?? [] }, { status: 200 });
  } catch (error) {
    console.error("GET Chat Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, chatId } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
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

    let chat;
    if (chatId) {
      chat = await prismaClient.chat.findUnique({
        where: { id: chatId },
      });
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    } else {
      chat = await prismaClient.chat.create({
        data: { userId: user.id },
      });
    }

    const pair = await prismaClient.pair.create({
      data: {
        chatId: chat.id,
        prompt,
        response: aiResponse,
      },
    });

    const updatedChat = await prismaClient.chat.findUnique({
      where: { id: chat.id },
      include: { exchanges: true },
    });

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    console.error("POST Chat Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
