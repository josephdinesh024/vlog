'use client'
import React, { useState } from 'react'
import sendMails from '../../lib/nodemailer'

const Page = () => {
    const [title,setTitle] = useState("")

  return (
    <div className='flex w-full'>
        <div className='w-1/2 p-6'>
            Write Content
            <label> Para
            <textarea type='text' name='para' onChange={(e)=>{setTitle(e.target.value)
                console.log(title)
            }} />
            </label>
        </div>
        <div className='w-1/2 p-6'>
            Print Content
            <span className='m-4'>{title}</span>
        </div>
        <h1>Send Mail</h1>
        <button onClick={async()=>{
            await sendMails('josephdinesh24@gmail.com','test',"<b>Hello world?</b> <a href='https://aptitude-lac.vercel.app/'>aptitude</a>")
            console.log('send mail')
        }}>send</button>
    </div>
  )
}

export default Page