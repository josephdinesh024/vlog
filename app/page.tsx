'use client'
import Image from "next/image";
import profile from '@/public/default.png'
import { useEffect, useState } from "react";
import {format} from 'date-fns'

export default function Home() {
  const [posts,setData] = useState();
  const url = process.env.NEXT_PUBLIC_URL+'/api/posts'
  useEffect(()=>{
    fetch(url)
    .then(response => response.json())
    .then(data => setData(data))
  },[])
  
  return (<>
        {posts?.map((post)=>(
          <div className="p-8">
            <div className="relative w-fit max-w-xl mb-8">
              <div className="flex space-x-2">
              <Image src={profile} alt="" width={38} height={38}/> 
              <h1 className="pt-2">{post.user.name}</h1>
              </div>
              <span className=" absolute right-0 text-xs font-light">{format(new Date(post.user.updated_date), 'dd MMM yyyy')} </span>
            </div>
            <div className="w-1/2">
              <h1 className="text-xl font-medium">{post.title} </h1>
              <p className="m-2">{post.content}</p>
            </div>
          </div>
  ))}
        </>
  );
}

