
'use client'
import { useState} from 'react'
import { addNewPosts } from '../../../lib/action/posts';
import 'quill/dist/quill.snow.css';
import Editor from '@/components/Editor';
import { useFormState } from 'react-dom';

const initialStatu = {
    message:null,
    loading:false
}

const NewPosts = () => {
    const [publish,setPublish] = useState("")
    const [status,formAction] = useFormState(addNewPosts,initialStatu)

  return (
    <> 
    { status?.loading?<LoadingUi/>:null}
    <div className='h-screen grid items-center'>
        <div className={`w-full flex justify-center -mt-20 ${ status?.loading?'blur-sm':''}`}>
            <div className='sm:w-2/3 p-4 shadow-xl rounded-2xl'>
                <h1 className='text-2xl font-medium m-4'>New Post</h1>
                {status?.message?<span className='pl-4 text-sm text-red-600'>{status.message}</span>:null}
                <form method='POST' action={formAction} className='space-y-4 sm:m-6'>
                    <div className='flex flex-col'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' name='title' placeholder='Post tilte' className="mt-2 input w-full max-w-lg"/>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='content'>Content</label>
                        <Editor />
                        {/* <textarea type='text' id='content' name='content' required placeholder='Post content'className="mt-2 textarea textarea-lg w-full max-w-lg text-sm"/> */}
                    </div>
                    <div className='space-x-2 flex justify-end'>
                        <input type='hidden' name='publish' value={publish}/>
                        <div className="tooltip" data-tip="To live">
                        <button className='btn rounded-lg' disabled={false} onClick={()=>{status.loading = true;
                            setPublish(true)}}>Publish</button>
                        </div>
                        <div className="tooltip" data-tip="Edit later">
                        <button className='btn rounded-lg'disabled={false} onClick={()=>{status.loading = true;
                            setPublish(false)}}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default NewPosts

const LoadingUi = ()=>{
    return (
        <div className='z-50 h-screen absolute grid content-center left-1/2'>
            <span className="loading loading-spinner loading-md"></span>
        </div>
    )
}