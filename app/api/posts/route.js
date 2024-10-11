import prisma from "@/lib/prisma"


export async function GET(params) {
    const post_id = params.nextUrl.searchParams.get('id')
    if(post_id){
        try {
            const data = await prisma.post.findFirst({where:{id:post_id}})
            return Response.json(data)
        } catch (error) {
            console.log("url error",error)
            return Response.json({message:'error'})
        }
    }else{
        try {
            const data = await prisma.post.findMany({where:{publish:true},include:{user:true}})
            return Response.json(data)
        } catch (error) {
            console.log("url error",error)
            return Response.json({message:'error'})
        }
    }
}