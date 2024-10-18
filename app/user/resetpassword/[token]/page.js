'use client'

import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { resetPasswordAction, verifyToken} from '@/lib/action/user'


const ResetPassword = ({params}) => {
    const [tokenData,setTokenData] = useState("")
    const {data:session} = useSession()
    const [passcord,setPasscord] = useState("");
    const [confirmPasscord,setConfirmPasscord] = useState("");
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
         verifyToken(params.token)
         .then(data => {setTokenData(data)
         })
    },[])
    if(tokenData?.message==='error'){
        return (
        <div className='w-full flex justify-center'>
            <div className='w-1/3 relative h-screen grid content-center -mt-16'>
                <h1>{tokenData.data}</h1>
            </div>
        </div>)
    }else if(tokenData?.message==='success'){
        
        if(session){
            signOut()
        }
    return (<>{loading?<LoadingUi />:null}
        <div className={`w-full flex justify-center ${loading?'blur-sm':''}`}>
            <div className='w-1/3 relative h-screen grid content-center'>
                <form className='space-y-4 -mt-10' action={resetPasswordAction}>
                    <input type='hidden' name='email' value={tokenData?.data}/>
                    <h1 className='text-xl'>Update Passcord</h1>
                    <h6 className='pl-4 text-sm -mt-2'>Create new passcord for your vlog</h6>
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
                                <input type="password" name='passcord' className="grow" value={passcord}
                                onChange={(e)=>setPasscord(e.target.value)}
                                placeholder='New Passcord' />
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
                                <input type="password" className="grow" value={confirmPasscord}  
                                onChange={(e)=>{
                                    setConfirmPasscord(e.target.value)
                                }}
                                placeholder='Confirm Passcord'/>
                            </label>
                        <button className="btn absolute right-0 rounded-xl"disabled={
                            (passcord && passcord === confirmPasscord)?false:true}
                            onClick={()=>setLoading(true)}>Change</button>
                </form>
            </div>
        </div></>
    )
    }
}

export default ResetPassword

const LoadingUi = ()=>{
    return (
        <div className='z-50 h-screen absolute grid content-center left-1/2'>
            <span className="loading loading-spinner loading-md"></span>
        </div>
    )
}