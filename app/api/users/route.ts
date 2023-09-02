import { prisma } from "@/lib/prisma";
import { NextResponse} from "next/server";

 export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    console.log(users)
    return NextResponse.json(users);
  }

  export async function POST(request: Request) {

    try {
      const {name, email} = await request.json()

    const user = await prisma.user.create({
      data : {
        t
      }
    })

    return new NextResponse(JSON.stringify(user), {
      status : 201, 
      headers: {"Content-type" : "application/json"}
    })
      
    } catch (error: any) {
       if (error.code === "P2002") {
      return new NextResponse("User with email already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, { status: 500 });
  }
    }
      
  

