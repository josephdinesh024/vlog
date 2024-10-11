'use server'

import { auth } from "@/app/auth"
import prisma from "../prisma";
import { redirect } from "next/navigation";


export const addNewPosts = async(formData) =>{
    const session = await auth();
    const title = formData.get('title')
    const content = formData.get('content')
    const publish = formData.get('publish')
    var data = null
    if (session){
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