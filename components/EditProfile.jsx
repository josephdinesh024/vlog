'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { EditProfileAction } from '@/lib/action/user'
import { useSession } from "next-auth/react"
import Link from 'next/link'


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
        <div className='flex justify-between'>
            <button className='btn rounded-lg bg-gray-300' onClick={username||email||image?updateSession:null}>Save</button>
            <button className='flex py-4' onClick={(e)=>{e.preventDefault()}}>
                <svg className='m-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00004 4.75421C6.20745 4.75421 4.75427 6.20739 4.75427 7.99997C4.75427 9.79256 6.20745 11.2457 8.00004 11.2457C9.79262 11.2457 11.2458 9.79256 11.2458 7.99997C11.2458 6.20739 9.79262 4.75421 8.00004 4.75421ZM5.75427 7.99997C5.75427 6.75967 6.75973 5.75421 8.00004 5.75421C9.24034 5.75421 10.2458 6.75967 10.2458 7.99997C10.2458 9.24027 9.24034 10.2457 8.00004 10.2457C6.75973 10.2457 5.75427 9.24027 5.75427 7.99997Z" fill="black"/>
                    <path d="M9.79647 1.34338C9.26853 -0.447793 6.73147 -0.447791 6.20353 1.34338L6.10968 1.66179C5.95246 2.19519 5.34321 2.44755 4.85487 2.18155L4.56336 2.02276C2.9235 1.12953 1.12953 2.9235 2.02276 4.56336L2.18155 4.85487C2.44755 5.34321 2.19519 5.95246 1.66179 6.10968L1.34338 6.20353C-0.447793 6.73147 -0.447791 9.26853 1.34338 9.79647L1.66179 9.89032C2.19519 10.0475 2.44755 10.6568 2.18155 11.1451L2.02276 11.4366C1.12953 13.0765 2.92349 14.8705 4.56335 13.9772L4.85487 13.8184C5.34321 13.5524 5.95246 13.8048 6.10968 14.3382L6.20353 14.6566C6.73147 16.4478 9.26853 16.4478 9.79647 14.6566L9.89032 14.3382C10.0475 13.8048 10.6568 13.5524 11.1451 13.8184L11.4366 13.9772C13.0765 14.8705 14.8705 13.0765 13.9772 11.4366L13.8184 11.1451C13.5524 10.6568 13.8048 10.0475 14.3382 9.89032L14.6566 9.79647C16.4478 9.26853 16.4478 6.73147 14.6566 6.20353L14.3382 6.10968C13.8048 5.95246 13.5524 5.34321 13.8184 4.85487L13.9772 4.56335C14.8705 2.92349 13.0765 1.12953 11.4366 2.02276L11.1451 2.18155C10.6568 2.44755 10.0475 2.19519 9.89032 1.66179L9.79647 1.34338ZM7.16273 1.6261C7.40879 0.7913 8.59121 0.791301 8.83727 1.6261L8.93112 1.94451C9.26845 3.08899 10.5757 3.63046 11.6235 3.05972L11.915 2.90094C12.6793 2.48463 13.5154 3.32074 13.0991 4.08501L12.9403 4.37653C12.3695 5.42433 12.911 6.73155 14.0555 7.06888L14.3739 7.16273C15.2087 7.40879 15.2087 8.59121 14.3739 8.83727L14.0555 8.93112C12.911 9.26845 12.3695 10.5757 12.9403 11.6235L13.0991 11.915C13.5154 12.6793 12.6793 13.5154 11.915 13.0991L11.6235 12.9403C10.5757 12.3695 9.26845 12.911 8.93112 14.0555L8.83727 14.3739C8.59121 15.2087 7.40879 15.2087 7.16273 14.3739L7.06888 14.0555C6.73155 12.911 5.42433 12.3695 4.37653 12.9403L4.08501 13.0991C3.32074 13.5154 2.48463 12.6793 2.90093 11.915L3.05972 11.6235C3.63046 10.5757 3.089 9.26845 1.94452 8.93112L1.6261 8.83727C0.7913 8.59121 0.791301 7.40879 1.6261 7.16273L1.94451 7.06888C3.08899 6.73155 3.63046 5.42433 3.05972 4.37653L2.90093 4.08501C2.48463 3.32073 3.32074 2.48463 4.08501 2.90093L4.37653 3.05972C5.42432 3.63046 6.73155 3.089 7.06888 1.94452L7.16273 1.6261Z" fill="black"/>
                </svg>
                <Link href="/posts/langsetting">language</Link></button>
        </div>
        </form>
        
    </div>
    </>
  )
}

export default EditProfile


