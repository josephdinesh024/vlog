import React from 'react'
import prisma from '@/lib/prisma'
import Post from '@/components/Post'
import { getUserId } from '@/lib/action/user'
import { redirect } from 'next/navigation'
const postPage = async() => {
    const id = await getUserId()
    var posts = null
    if(id){
        posts = await prisma.post.findMany({where:{user_id:id}})
    } else{
        redirect('/')
    }
  return (<>
    { posts && <div>
        <div className='w-9/12 m-12'>
            <div className='flex justify-between p-8'>
                <div >
                    <h1 className='text-2xl font-semibold capitalize'>Published post</h1>
                    {posts?.map((post)=>(
                        <>
                        {post.publish && <Post posts={post}/>}
                        </>
                    ))}
                </div>
                <div >
                    <h1 className='text-2xl font-semibold capitalize'>Unpublished post</h1>
                    {posts?.map((post)=>(
                        <>
                        {!post.publish && <Post posts={post}/>}
                        </>
                    ))}
                </div>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default postPage