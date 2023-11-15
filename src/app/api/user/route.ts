import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = body;
        console.log(body)
        const exist = await prisma.user.findUnique({
            where: { email: email }
        })
        if (exist) {
            return NextResponse.json({ user: null, message: "user with this username already exists" },
                { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })

        return NextResponse.json({ message: "user created successfully" })

    }
    catch (err: Error | any) {
        console.log(err)
        return NextResponse.json({ err: err.message })
    }


}