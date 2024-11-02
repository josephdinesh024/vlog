'use client'
import { generateToken } from '@/lib/action/user'
import { useFormState } from 'react-dom'
import { useState } from 'react'


const initialStatu = {
    message:null,
    loading:false
}

const PasswordResetLink = () => {
    const [status,formAction] = useFormState(generateToken,initialStatu)
    const [loading,setLoading] = useState(false)

  return (
    <>
        {loading && !status?.message?<LoadingUi />:null}
        <div className={`w-full flex justify-center ${loading && !status?.message?'blur-sm':''}`}>
            <div className='sm:w-1/3 relative h-screen grid content-center'>
                <form className='-mt-12 relative space-y-4' action={formAction}>
                    <h1 className='text-2xl'>Passcord Reset</h1>
                    <h6 className='text-sm pl-4'>Enter your email to send reset password link</h6>
                    {status.message?<span className='pl-4 text-xs text-red-600 mt-2'>* {status.message}</span>:null}
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
                        <input type="email" name="email" className="grow"  required
                        placeholder="Email" />
                    </label>
                    <button className="btn absolute right-0 rounded-xl"
                    onClick={()=>{setLoading(loading?false:true)
                        status.message=null
                    }}
                    >Reset link</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default PasswordResetLink

const LoadingUi = ()=>{
    return (
        <div className='z-50 h-screen absolute grid content-center left-1/2'>
            <span className="loading loading-spinner loading-md"></span>
        </div>
    )
}