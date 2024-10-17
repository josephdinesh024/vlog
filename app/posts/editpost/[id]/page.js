'use client'
import { useEffect, useState } from "react";
import {updatePost} from '@/lib/action/posts'

const EditPosts = ({params}) => {
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [publish,setPublish] = useState("");
    const [post,setPost] = useState("");
    
    useEffect(()=>{
        const url = process.env.NEXT_PUBLIC_URL+'/api/posts?id='+params.id
        fetch(url)
        .then(response => response.json())
        .then(data=>{setPost(data)
        setTitle(data.title)
        setContent(data.content)
        setPublish(data.publish)
        })
    },[])
  return (
    <div className='h-screen grid items-center'>
        <div className='flex justify-center'>
            <div className='w-2/3 p-8 shadow-xl rounded-2xl'>
                <h1 className='text-2xl font-medium m-4'>New Post</h1>
                {post && 
                <form method='POST' action={updatePost} className='space-y-4 m-6 relative mb-8'>
                    <input type="hidden" name="post_id" value={post.id}/>
                    <div className='flex flex-col'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' name='title' required value={title} 
                        onChange={(e)=>setTitle(e.target.value)} className="mt-2 input w-full max-w-lg"/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='content'>Content</label>
                        <textarea type='text' id='content' name='content' required value={content} 
                        onChange={(e)=>setContent(e.target.value)} className="mt-2 textarea textarea-lg w-full max-w-lg text-sm"/>
                    </div>
                    {/* <div>
                        <label className='flex'><h1 className='text-lg pr-1 -mt-2'>Images</h1>
                        <input type="checkbox" className="toggle toggle-xs" onChange={()=>{
                            {isimage?setIsImage(false):setIsImage(true)}
                        }}/>
                        </label>
                    </div>
                    <div className={isimage?'hidden:block':'hidden'}>
                        <label className='input input-bordered flex items-center gap-2 max-w-xs cursor-pointer'>
                            Select Image
                        <input type="file" name='image' className='hidden'/>
                        </label>
                    </div> */}
                    <div>
                        <label className='flex'>
                        <input type="checkbox" name="publish" value={publish} className="toggle toggle-xs" onChange={()=>{
                            setPublish(publish?false:true)
                        }} defaultChecked={publish}/>
                        <h1 className='pl-1 -mt-1.5'>{publish?'Published':'To Publish'}</h1>
                        </label>
                    </div>
                    <div className='space-x-2 absolute right-0'>
                        <div className="tooltip" data-tip="Save change">
                        <button className='btn rounded-lg'>Save</button>
                        </div>
                    </div>
                </form>
                }
            </div>
        </div>
    </div>
  )
}

export default EditPosts