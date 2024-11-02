import prisma from "../../lib/prisma";

export async function  GET(){
    const data = await prisma.post.findMany({include:{feedbacks:true}})
    return Response.json({count:data})
}