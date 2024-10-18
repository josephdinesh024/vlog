'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { EditProfileAction } from '@/lib/action/user'
import { useSession } from "next-auth/react"


const EditProfile = ({userId}) => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [editForm,setEditForm] = useState(false);
    const [sessiondata,setSessionData] = useState("");

    const { data: session, update } = useSession()
    const updateSession = ()=>{
        update({});
        setEditForm(false)
    }
    useEffect(()=>{
        if(session && session.user)
            setSessionData(session.user)
    },[session])
    
  return (<>

    <div className='space-y-2'>
        <button className='absolute right-0 top-0' onClick={() =>{setEditForm(editForm?false:true)
        }}>
            <svg class="bg-gray-50 m-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="black" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="black" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <form className={editForm?'hidden:block space-y-2':'hidden'} method='post' action={EditProfileAction}>
            <input type='hidden' name='id' value={userId} />
        <label className="input input-bordered flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" name='username' className="grow" value={username?username:sessiondata?.name}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Username" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="email" name='email' className="grow" value={email?email:sessiondata?.email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email" />
        </label>
        <label className="input input-bordered flex items-center gap-2 cursor-pointer">
            <svg width="16" height="16" className="mt-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8ZM10 5C10 6.10457 9.10457 7 8 7C6.89543 7 6 6.10457 6 5C6 3.89543 6.89543 3 8 3C9.10457 3 10 3.89543 10 5Z" fill="black"/>
                <path d="M14 13C14 14 13 14 13 14H3C3 14 2 14 2 13C2 12 3 9 8 9C13 9 14 12 14 13ZM13 12.9965C12.9986 12.7497 12.8462 12.0104 12.1679 11.3321C11.5156 10.6798 10.2891 10 7.99999 10C5.71088 10 4.48435 10.6798 3.8321 11.3321C3.15375 12.0104 3.00142 12.7497 3 12.9965H13Z" fill="black"/>
            </svg>
            <input type="file" name='image' className="hidden grow" 
            onChange={(e)=>setImage(e.target.value)}
            />
           <span className='text-gray-400'>Profile Image</span>
        </label>
        <button className='btn rounded-lg bg-gray-300' onClick={username||email||image?updateSession:null}>Save</button>
        </form>
    </div>
    </>
  )
}

export default EditProfile
