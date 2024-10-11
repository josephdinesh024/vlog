import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth"
import prisma from '../lib/prisma'
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'

export const {handlers,signIn,signOut,auth} = NextAuth({
    session:{
        strategy:'jwt'
    },
    adapter:PrismaAdapter(prisma),
    providers:[
        Credentials({
            credential: {
              email: { label: "email" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credential){
                const user = await prisma.user.findUnique({where:{email:credential?.email}})

                if(user && await bcrypt.compare(credential?.password,user.password))
                    return user
                else
                    throw new Error("User not found.")
            },
        }),
    ],
});