'use client'

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

const UserLogin = () => {
    const [email,setEmail] = useState("")
    const [passcord,setPasscord] = useState("")

    const getlogin = async(e)=>{

        e.preventDefault();
        const result = await signIn('credentials',{
            redirect:false,
            email,
            password:passcord,
        })

        if(!result?.error){
            location.href = '/'
        }
            
    }

  return (
    <div className='h-screen grid content-center'>
        <div className='w-full flex justify-center'>
            <div className='w-1/3 space-y-4 -mt-14 relative'>
                <form method="POST" onSubmit={getlogin} className="space-y-4">
                <h1 className='text-center text-xl font-mono font-semibold p-4'>Login Form</h1>
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
                <input type="email" name="email" className="grow" 
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email" />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input type="password" name="password" className="grow" value={passcord} 
                onChange={(e)=>setPasscord(e.target.value)}
                placeholder="Passcord"/>
                </label>
                <button className="btn absolute right-0 rounded-xl">Login</button>
                </form>
                <h6 className="text-center pt-12">Want to create account ? <Link href='/user/register'className="link link-neutral text-sm">Register</Link></h6>
                <h6 className="text-center">or</h6>
                <h6 className="text-center"><Link href='/user/requestreset'className="link link-neutral text-sm">forgot password ?</Link></h6>
            </div>
        </div>
    </div>
  )
}

export default UserLogin