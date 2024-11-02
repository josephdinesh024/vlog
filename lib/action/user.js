'use server'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/app/auth'
import fs from "node:fs/promises";
import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import sendEmail from '../nodemailer'

export const createRegister = async (previousStatu,formData) =>{
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
        // redirect('/user/login')
        // return {message:'Success'}
        
    }catch(error)
    {
        console.log(error.meta)
        return {message:'Error to create user',target:error.meta.target}
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
            return user
        } catch (error) {
            console.error("user not found",error)
        }
    }
}

export const EditProfileAction = async(formData) =>{
    
    const file = formData.get("image");
    const name = formData.get('username')
    const email = formData.get('email')
    const id = formData.get('id')
    var url = ''
    var data = {};
    try {
        if(name)
        data['name']=name;
        if(email)
        data['email']=email;

        if(file.size){
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const random = randomBytes(32).toString('base64');
            url = random+'.'+file.name.split('.').pop()
            data['image']=url
            await fs.writeFile(`./public/uploads/${url}`, buffer);
        }
        
        await prisma.user.update({where:{id:Number(id)},data})
        

      } catch (e) {
        console.error(e);
       
      }
      if(data){
        redirect('/posts')
      }
}

export const generateToken = async(previousStatu,formData)=>{
    const email = formData.get('email')
    const emailData = await prisma.user.findFirst({where:{email}})
    if(emailData){
        const SECRET_KEY = "khbhf 4rkh4r34994h  hu49h 89 9rnfi"
        const payload = {
            exp: Math.floor(Date.now() / 1000) + (60*5),
            data: email
        }
        var data =null
        try{
            const token = jwt.sign(payload,SECRET_KEY)
            const url = process.env.NEXT_PUBLIC_URL+`/user/resetpassword/${token}`
            const body = `<p> This is a mail to reset your vlog passcord. You can find link to reset passcord below</p><a href=${url}>click here</a><br><p> if its not you how request this mail just ignore this Mail`
            await sendEmail(email,'Password Reset Mail','Reset Mail',body)
            data = "success"
        }catch(error){
            console.log('error for mail',error)
        }
    }
    else{
        return {message:'Enter a valid email id'}
    }
    if(data)
        redirect('/')
}

export const verifyToken= (token)=>{
    const SECRET_KEY = "khbhf 4rkh4r34994h  hu49h 89 9rnfi"
    try {
        const tokenData = jwt.verify(token,SECRET_KEY);
        const data = {message:'success',data:tokenData.data}
        return data
    } catch (error) {
        const data ={message:'error',data:"Expired Token "+error}
        return data
    }
}

export const resetPasswordAction = async(formData)=>{
    const newPasscord = formData.get('passcord')
    const email = formData.get('email')
    const hashpasscord = await bcrypt.hash(newPasscord,10)
    var data = null
    try {
        data = await prisma.user.update({where:{email},data:{password:hashpasscord}})
        
    } catch (error) {
        console.log(error)
    }
    if(data)
        redirect('/user/login')
}