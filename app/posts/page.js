import prisma from '@/lib/prisma'
// import Posts from '@/components/Posts'
import { getUserId } from '@/lib/action/user'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '../auth'
import EditProfile from '@/components/EditProfile'
import dynamic from 'next/dynamic'

const PostsImport = dynamic(
    () => import('@/components/Posts'),
    { ssr: false }
  )

const PostPage = async() => {
    const session = await auth()
    if(session && session.user){
    const user = await getUserId()
    var posts = null
  return (<>
    { user?.id && <div>
        <div className='sm:w-9/12 mt-12'>
            <div className='w-full flex flex-col lg:flex-row justify-between p-8 space-y-4 sm:space-y-0'>
                {/* <div >
                    <h1 className='text-2xl font-semibold capitalize'>Published post</h1>
                    {posts?.map((post,index)=>(
                        <>
                        {post.publish && <Post key={index} posts={post}/>}
                        </>
                    ))}
                </div>
                <div >
                    <h1 className='text-2xl font-semibold capitalize'>Unpublished post</h1>
                    {posts?.map((post,index)=>(
                        <>
                        {!post.publish && <Post key={index} posts={post}/>}
                        </>
                    ))}
                </div> */}
                {user?.id && <PostsImport userId={user?.id}/>}
                <div className='sm:ml-14 flex flex-col'>
                    <div className='w-80 p-6 border rounded-3xl shadow-xl relative'>
                    <Image src={`/uploads/${user.image}`} alt="" width={75} height={75}/>
                    <h1 className='text-xl mt-2'>{user.name}</h1>
                    <h1 className='text-sm'>{user.email}</h1>
                    {/* <h1 className='text-lg my-2 mt-4'>Published : {posts.filter(post=>post.publish).length} </h1>
                    <h1 className='text-lg'>Unpublished : {posts.filter(post=>!post.publish).length}</h1> */}
                    <EditProfile userId={user.id} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    }
    </>
  )
}else{
    redirect('/user/login')
}
}

export default PostPage