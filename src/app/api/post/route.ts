import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request:Request){
    const res = await request.json()
    const {title, content} = res;
     const result = await prisma.post.create({
        data: {
            title,
            content,
            published: true,
        }
     })zz

    return NextResponse.json({result})
}

export async function GET(request:Request){
    const feed = await prisma.post.findMany({
      });
   

    return NextResponse.json(feed)
}