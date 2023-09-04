import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export const GET = async (request: Request, {params}:any) => {
 try {
    const {id} = params; 

    const post = await prisma.post.findUnique({
        where : {
            id : id, 
        }
    })

    if(!post) {
        return NextResponse.json(
            {message : 'Post not found', Error}, 
            {status : 404}, 
        )
    }
    return NextResponse.json(post)
   
 } catch (error) {
    return NextResponse.json(
    
        {message : 'Get error', error}, 
        {status : 500}
    )
 }
}

export const PATCH = async (request: Request, { params }: { params: { id : number} }) => {
    try {
      const body = await request.json();
      const { title, author, content } = body;
        const {id} = params;
  
      const updatePost = await prisma.post.update({
        where : {
            id, 
        }, 
        data: {
          title,
          author,
          content,
        },
      });

      
    if(!updatePost) {
        return NextResponse.json(
            {message : 'Post not found', Error}, 
            {status : 404}, 
        )
    }
 
      return NextResponse.json(updatePost);
    } catch (error) {
      return NextResponse.json(
        {
          message: "update Error",
          error,
        },
        { status: 500 }
      );
    }
  };
  