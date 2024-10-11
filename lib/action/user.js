'use server'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/app/auth'


export const createRegister = async (formData) =>{
    const username = formData.get('username')
    const email = formData.get('email')
    const passcord = formData.get('passcord')
    const hashpasscord = await bcrypt.hash(passcord,10)
    var data = null
    try{
        data = await prisma.user.create({data:{
            name:username,
            email:email,
            password:hashpasscord
        }})
       
        
    }catch(error)
    {
        console.error("error user create",error)
    }
    
    if(data)
    redirect('/user/login')
    
}


export const getUserId = async()=>
{
    const session = await auth();
    if(session){
        try {
            const user = await prisma.user.findUnique({where:{email:session.user.email}})
            return user.id
        } catch (error) {
            console.error("user not found",error)
        }
    }
}