'use server'

import { auth } from "@/app/auth"
import prisma from "../prisma";
import { redirect } from "next/navigation";
import {differenceInDays,differenceInMinutes, differenceInMilliseconds} from 'date-fns'



export const addNewPosts = async(preStatus,formData) =>{
    const title = formData.get('title')
    const content = formData.get('content')
    const publish = formData.get('publish')
    const session = await auth()
    var data = null
    if (title && content){
        try {
            const user = await prisma.user.findUnique({where:{email:session.user.email}})
            try {
                data = await prisma.post.create({
                    data:{
                        title,
                        content,
                        publish: publish=='true'?true:false,
                        user_id:user.id
                    }
                })
                console.log(data)
            } catch (error) {
                console.error("user error",error)
            }
            console.log("function called ",formData,user)
        } catch (error) {
            console.error("user error",error)
        }
    }
    else{
        return {message:'* Title or Content should not be empty',loading:false}
    }
    if(data)
        redirect('/')
}

export const updatePost = async(formData)=>{
    const publish = formData.get('publish')?true:false
    const title = formData.get('title')
    const content = formData.get('content')
    const post_id = formData.get('post_id')
    var data = null
    try {
         data = await prisma.post.update({where:{id:post_id},data:{
            title,
            content,
            publish
         }})       
    } catch (error) {
        console.error("post update error",error)
    }
    if(data)
        redirect('/posts')
    console.log(formData,publish,title,content,post_id)
}


export const setReplyCommand = async(formData)=>{
    const commandId = formData.get('commandId')
    const emailId = formData.get('emailId')
    const replyCommand = formData.get('replyCommand')
    try {
        await prisma.reply.create({data:{
            text:replyCommand,
            command_id:commandId,
            user_emailId:emailId
        }})
    } catch (error) {
        console.log(error)
    }
}

export const Timeposted = (dateTime)=>{
    const date = differenceInDays(Date.now(),dateTime)
    if(date<1)
    {
      const minutes = (differenceInMinutes(Date.now(),dateTime))
      if(Number(minutes)<60){
        const second = (differenceInMilliseconds(Date.now(),dateTime)/1000)
          if(second<60){
            return (differenceInMilliseconds(Date.now(),dateTime)/1000).toFixed(0)+'s'
          }
          else{
            return (differenceInMilliseconds(Date.now(),dateTime)/60000).toFixed(0)+'m'
          }
      }else{
        return (differenceInMinutes(Date.now(),dateTime)/60).toFixed(0)+'h'
      }
    }
    else if(date>=1&&date<=7){
      return (differenceInDays(Date.now(),dateTime))+'d'
    }else{
      return (differenceInDays(Date.now(),dateTime)/7).toFixed(0)+'w'
    }
  }