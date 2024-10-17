import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth"
import prisma from '../lib/prisma'
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'

export const {handlers,signIn,signOut,auth,update} = NextAuth({
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
    callbacks:{
       async jwt({token,session,trigger}){
        if(trigger==='update'){
        const user = await prisma.user.findUnique({where:{id:Number(token.sub)}})
        token = {...token, name:user.name,email:user.email,picture:user.image}
        console.log('update',user)
        }
        session=token
        return session
        },
        // async session({session,token}){
        //     session.user = token
        //     return session
        // }
    }
});