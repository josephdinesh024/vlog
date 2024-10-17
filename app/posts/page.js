
import prisma from '@/lib/prisma'
import Post from '@/components/Post'
import { getUserId } from '@/lib/action/user'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '../auth'
import EditProfile from '@/components/EditProfile'
import { useId } from 'react'

const PostPage = async() => {
    const id = await getUserId()
    const session = await auth()
    var posts = null
    if(id){
        posts = await prisma.post.findMany({where:{user_id:id}})
    } else{
        redirect('/')
    }
  return (<>
    { posts && <div>
        <div className='w-9/12 m-12'>
            <div className='w-full flex justify-between p-8'>
                <div >
                    <h1 className='text-2xl font-semibold capitalize'>Published post</h1>
                    {posts?.map((post)=>(
                        <>
                        {post.publish && <Post key={useId} posts={post}/>}
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
                <div className='ml-14 flex flex-col'>
                    <div className='w-80 p-6 border rounded-3xl shadow-xl relative'>
                    <Image src={`/uploads/${session?.user.image}`} alt="" width={75} height={75}/>
                    <h1 className='text-xl mt-2'>{session?.user.name}</h1>
                    <h1 className='text-sm'>{session?.user.email}</h1>
                    <h1 className='text-lg my-2 mt-4'>Published : {posts.filter(post=>post.publish).length} </h1>
                    <h1 className='text-lg'>Unpublished : {posts.filter(post=>!post.publish).length}</h1>
                    <EditProfile userId={id} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default PostPage