import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logMonitor, monitor } from "@/lib/monitor";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const groq = new Groq({
  apiKey: process.env.API_KEY!,
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MAX_MESSAGES = 20;
const KEEP_LAST = 6;
function buildMessages(chat: any, userPrompt: string) {
  const messages: any[] = [];

  if (chat?.summary) {
    messages.push({
      role: "system",
      content: `Conversation summary:\n${chat.summary}`,
    });
  }

  chat?.exchanges?.slice(-KEEP_LAST).forEach((ex: any) => {
    messages.push({ role: "user", content: ex.prompt });
    messages.push({ role: "assistant", content: ex.response });
  });

  messages.push({ role: "user", content: userPrompt });

  return messages;
}

async function summarizeChat(
  oldExchanges: any[],
  previousSummary: string = "",
) {
  const content = oldExchanges
    .map((e) => `User: ${e.prompt}\nAssistant: ${e.response}`)
    .join("\n");

  const res = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "Summarize the conversation clearly. Keep goals, decisions, user preferences, and technical context. Remove small talk.",
      },
      {
        role: "user",
        content: `Previous summary:\n${previousSummary || "None"}\n\nConversation:\n${content}`,
      },
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

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
        include: { exchanges: true },
      });

      if (!chat) {
        return NextResponse.json({ message: "No chat found" }, { status: 404 });
      }

      return NextResponse.json({ data: chat }, { status: 200 });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      include: {
        chats: { orderBy: { createdAt: "desc" } },
        subscription: true,
      },
    });

    return NextResponse.json({ chats: user?.chats ?? [] }, { status: 200 });
  } catch (error) {
    logMonitor("error", `GET Chat Error: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
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
    logMonitor("info", `Chat request — model: ${modelProvider ?? "groq"}, user: ${session.user.email}`);
    if (!prompt) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 },
      );
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPaidUser =
      user.subscription &&
      user.subscription.status === "captured" &&
      user.subscription.plan === "Pro";

    if (
      (modelProvider === "openai" ||
        modelProvider === "claude" ||
        modelProvider === "Gemini-2.5-pro") &&
      !isPaidUser
    ) {
      return NextResponse.json(
        { error: `${modelProvider} is available only for paid users.` },
        { status: 403 },
      );
    }
    let chat;
    if (chatId) {
      chat = await prismaClient.chat.findUnique({ where: { id: chatId } });
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    } else {
      let title: string | undefined;
      try {
        const t = await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "user",
              content: `Generate a short (3-6 word) descriptive title for this chat based on the user's first message:\n${prompt}`,
            },
          ],
          max_tokens: 5,
        });
        title = t?.choices?.[0]?.message?.content?.trim();
      } catch (err) {
        logMonitor("warn", `Title generation failed: ${err instanceof Error ? err.message : String(err)}`);
      }

      if (!title || title.length === 0) {
        const firstLine = (prompt || "").split(/\n/)[0].trim();
        if (firstLine.length > 0) {
          title = firstLine.length > 60 ? `${firstLine.slice(0, 60)}...` : firstLine;
        } else {
          title = `Chat ${Date.now().toString(36)}`;
        }
      }

      chat = await prismaClient.chat.create({
        data: { userId: user.id, title },
      });
    }

    const fullChat = await prismaClient.chat.findUnique({
      where: { id: chat.id },
      include: { exchanges: true },
    });

    const messages = buildMessages(fullChat, prompt);
    let aiResponse = "";

    switch (modelProvider || "groq") {
      case "groq": {
        const res = await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages,
        });
        aiResponse = res.choices[0].message.content ?? "";
        break;
      }

      case "openai": {
        const res = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
        });
        aiResponse = res.choices[0].message.content ?? "";
        break;
      }

      case "gemini": {
        const model = gemini.getGenerativeModel({
          model: "gemini-2.5-flash",
        });
        const result = await model.generateContent(
          messages.map((m) => m.content).join("\n"),
        );
        aiResponse = result.response.text();
        break;
      }

      case "claude":
        return NextResponse.json(
          { error: "Claude not implemented yet" },
          { status: 501 },
        );

      default:
        return NextResponse.json(
          { error: "Unsupported model provider" },
          { status: 400 },
        );
    }

    await prismaClient.pair.create({
      data: {
        chatId: chat.id,
        prompt,
        response: aiResponse,
      },
    });

    if (fullChat!.exchanges.length > MAX_MESSAGES) {
      const oldExchanges = fullChat!.exchanges.slice(
        0,
        fullChat!.exchanges.length - KEEP_LAST,
      );

      const summary = await summarizeChat(
        oldExchanges,
        fullChat!.summary || "",
      );

      await prismaClient.chat.update({
        where: { id: chat.id },
        data: { summary },
      });
    }

    const updatedChat = await prismaClient.chat.findUnique({
      where: { id: chat.id },
      include: { exchanges: true },
    });

    logMonitor("info", `Chat response sent — model: ${modelProvider ?? "groq"}, chatId: ${updatedChat?.id}`);
    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    logMonitor("error", `POST Chat Error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("POST Chat Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
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
    if (!id) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    await prismaClient.pair.deleteMany({ where: { chatId: id } });
    await prismaClient.chat.delete({ where: { id } });

    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    logMonitor("error", `DELETE Chat Error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("DELETE Chat Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
