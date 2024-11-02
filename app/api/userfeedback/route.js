
import prisma from "@/lib/prisma"

export async function POST(params) {
    const {postId,userEmail} = await params.json()
    try {
        const post = await prisma.post.findUnique({select:{feedbacks:{select:{id:true}}},where:{id:postId}})
        const data = await prisma.userOnFeedback.findMany({select:{liked:true},where:{
        user:{email:userEmail},
        feedback_id:post.feedbacks.id,
    }})
    return Response.json({data})
    } catch (error) {
        return Response.json({message:error})
    }
}
