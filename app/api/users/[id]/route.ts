import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: any} }
) {
  const { id } = params;

  // Ensure 'id' is properly formatted as a UserWhereUniqueInput
  const where = { id: parseInt(id) };
  const user = await prisma.user.findUnique({
    where: where,
  });

  if (!user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(user);
}


export async function PATCH(
  request: Request,
  { params }: { params: { id : number} }
) {
   const {id} = params; 
  let json = await request.json();

  const updated_user = await prisma.user.update({
    where: { id },
    data: json,
  });

  if (!updated_user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(updated_user);
}

export async function DELETE(request: Request, { params }: any) {
  try {
    const { id } = params;

    // Ensure 'id' is properly formatted as a UserWhereUniqueInput
    const where = { id: parseInt(id) }; // Assuming 'id' is an integer

    await prisma.user.delete({
      where: where,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No user with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
