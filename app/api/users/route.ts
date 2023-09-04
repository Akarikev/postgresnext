import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email } = body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    console.log(JSON.stringify(newUser, null, 2));
    return NextResponse.json(JSON.stringify(newUser, null, 2));
  } catch (err) {
    return NextResponse.json(
      {
        message: "User creation Error",
        err,
      },
      { status: 500 }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    const newUser = await prisma.user.findMany();

    return NextResponse.json(newUser);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Get Error",
        err,
      },
      { status: 500 }
    );
  }
};
