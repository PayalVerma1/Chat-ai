import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { status: "error", error: "Missing email" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { status: "error", error: "User not found" },
        { status: 404 }
      );

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      status: subscription?.status === "active" ? "active" : "inactive",
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: "Server error" },
      { status: 500 }
    );
  }
}
