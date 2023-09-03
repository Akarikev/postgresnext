import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { title, author, content } = body;

    const newPost = await prisma.post.create({
      data: {
        title,
        author,
        content,
      },
    });
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      {
        message: "User creation Error",
        error,
      },
      { status: 500 }
    );
  }
};
