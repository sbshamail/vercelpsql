import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Account, User as AuthUser } from "next-auth";
import prisma from "@/lib/prisma"
import GithubProvider from "next-auth/providers/github"

export const authOptions: any = {

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.password || !credentials?.email) {
                    return null;
                }
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });
                if (!existingUser) {
                    return null
                }
                const passwordMatch = existingUser.password === credentials.password;
                if (!passwordMatch) {
                    return null
                }
                return{
                    ...existingUser
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account: Account }) {
            if (account?.provider == "credentials") {
                return true;
            }
           
            if (account?.provider == "github") {
                console.log( user, account)
                try {
                    const existingUser = await prisma.user.findUnique({
                        // @ts-ignore
                        where: { email: user?.email  }
                    })
                    if (!existingUser) {
                        const newUser = await prisma.user.create({
                            // @ts-ignore
                            data: {
                                // @ts-ignore
                                email:user.email ,
                                username:user.name
                            }
                        })
                        return true;
                    }
                } catch (err) {
                    console.log("Error saving user", err);
                    return false;
                }
            }
        }
    }
}
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }