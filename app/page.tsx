
import Image from "next/image";
import profile from '@/public/uploads/default.png'
import {format} from 'date-fns'
import prisma from "@/lib/prisma";

export default async function Home() {

  const data = await prisma.post.findMany({where:{publish:true},include:{user:true}})

  return (<>
        {data && <> {data.map((post,index)=>(
          <div className="p-8" key={index}>
            <div className="relative w-fit max-w-xl mb-8">
              <div className="flex space-x-2">
              <Image src={profile} alt="" width={38} height={38}/> 
              <h1 className="pt-2">{post?.user?.name}</h1>
              </div>
              <span className=" absolute right-0 text-xs font-light">{format(new Date(post?.user?.updated_date?post?.user?.updated_date:1), 'dd MMM yyyy')} </span>
            </div>
            <div className="w-1/2">
              <h1 className="text-xl font-medium">{post.title} </h1>
              <p className="m-2">{post.content}</p>
            </div>
          </div>
  ))}
  </>
  }
        </>
  );
}

