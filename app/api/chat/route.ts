import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const groq = new Groq({
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await req.json();
    const content = result.prompt;

    if (!content) {
      return NextResponse.json({ error: "No content provided" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content }],
    });
    const airesponse = response.choices[0].message.content;

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
        prompt: content,
        response: airesponse ?? "",
      },
    });

    return NextResponse.json({ chat: chat, pair: pair });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}