'use server'
import { auth } from '@/app/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const setcookie = async()=>{
    const session = await auth()
    const user = await prisma.user.findUnique({where:{email:session.user.email}})
    cookies().set("NEXT_LANGU",user.language)
  }

export const getcookie = ()=>{
    return cookies().get('NEXT_LANGU')?.value
}