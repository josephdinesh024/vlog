
'use client'
import { useState } from 'react'
import { addNewPosts } from '../../../lib/action/posts';

const NewPosts = () => {
    const [isimage,setIsImage] = useState(false);
    const [publish,setPublish] = useState("")
  return (
    <div className='h-screen grid items-center'>
        <div className='flex justify-center'>
            <div className='w-2/3 p-8 shadow-xl rounded-2xl'>
                <h1 className='text-2xl font-medium m-4'>New Post</h1>
                <form method='POST' action={addNewPosts} className='space-y-4 m-6 relative mb-8'>
                    <div className='flex flex-col'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' name='title' required placeholder='Post tilte' className="mt-2 input w-full max-w-lg"/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='content'>Content</label>
                        <textarea type='text' id='content' name='content' required placeholder='Post content'className="mt-2 textarea textarea-lg w-full max-w-lg text-sm"/>
                    </div>
                    <div>
                        <label className='flex'><h1 className='text-lg pr-1 -mt-2'>Images</h1>
                        <input type="checkbox" className="toggle toggle-xs" onChange={()=>{
                            isimage?setIsImage(false):setIsImage(true)
                        }}/>
                        </label>
                    </div>
                    <div className={isimage?'hidden:block':'hidden'}>
                        <label className='input input-bordered flex items-center gap-2 max-w-lg cursor-pointer'>
                            Select Image
                        <input type="file" name='image' className='hidden'/>
                        </label>
                    </div>
                    <div className='space-x-2 absolute right-0'>
                        <input type='hidden' name='publish' value={publish}/>
                        <div className="tooltip" data-tip="To live">
                        <button className='btn rounded-lg' onClick={()=>setPublish(true)}>Publish</button>
                        </div>
                        <div className="tooltip" data-tip="Edit later">
                        <button className='btn rounded-lg'onClick={()=>setPublish(false)}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default NewPosts