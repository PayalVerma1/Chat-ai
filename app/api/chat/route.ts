import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const groq = new Groq({
  apiKey: process.env.API_KEY!,
});
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    const { prompt, chatId, modelProvider } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }
   let aiResponse = "";

switch (modelProvider || "groq") { 
  case "groq":
    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    aiResponse = groqResponse.choices[0].message.content ?? "";
    break;

  case "gemini":
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    aiResponse = response.text();
    break;

   case "openai":
          const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    aiResponse = openaiResponse.choices[0].message.content ?? "";
    break;


        case "claude":
          return NextResponse.json(
            { error: "Claude integration not yet implemented" },
            { status: 501 }
          );

        default:
          return NextResponse.json(
            { error: `Model provider '${modelProvider}' not supported.` },
            { status: 400 }
          );
}


    // const response = await groq.chat.completions.create({
    //   model: "llama-3.3-70b-versatile",
    //   messages: [{ role: "user", content: prompt }],
    // });

    // const aiResponse = response.choices[0].message.content ?? "";

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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = req.nextUrl.searchParams.get("id");
    console.log("DELETE Chat ID:", id);
    if (!id) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chat = await prismaClient.chat.findUnique({
      where: { id },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    await prismaClient.pair.deleteMany({ where: { chatId: id } });
    await prismaClient.chat.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Chat Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
