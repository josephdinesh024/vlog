
import Image from "next/image";
import profile from '@/public/uploads/default.png'
import {format} from 'date-fns'
import prisma from "@/lib/prisma";
import Link from "next/link";


export default async function Home() {

  const data = await prisma.post.findMany({orderBy:{updated_date:'desc'},where:{publish:true},include:{user:true}})

  return (<>
        {data && <div className=""> {data.map((post,index)=>(
          <div className="p-8" key={index}>
            <div className=" max-w-xl mb-8">
              <div className="flex space-x-2">
              <Image src={profile} alt="" width={38} height={38}/> 
              <h1 className="pt-2">{post?.user?.name}</h1>
              </div>
              <span className="pl-8 text-xs font-light"> {format((String(post?.updated_date)), 'PPP')} </span> 
            </div>
            <div className="sm:w-1/2">
              <Link href={'/vlog/'+post.id}><h1 className="text-xl font-medium">{post.title} </h1></Link>
              {/* <p className="m-2">{post.content.slice(0,150)} ....</p> */}
              <div dangerouslySetInnerHTML={{ __html: post.content.slice(0,500)}} className="m-2" /></div>
          </div>
  ))}
  </div>
  }
        </>
  );
}

