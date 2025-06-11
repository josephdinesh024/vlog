
import prisma from "@/lib/prisma"


export async function GET(params) {
    const id = params.nextUrl.searchParams.get('id')
    const data = await prisma.feedback.findMany({include:{commands:{include:{user:{select:{email:true}},replys:true}}},where:{post_id:id}})
    return Response.json({data})
}

export async function POST(params) {
    const data = await params.json()
    try {
        const post = await prisma.post.findUniqueOrThrow({select:{feedbacks:true,id:true},where:{id:data.postId}})
        const {id} = await prisma.user.findFirstOrThrow({select:{id:true},where:{email:data.userEmail}})
        if(post.feedbacks){
            try{
                const feedback = await prisma.userOnFeedback.findUniqueOrThrow({where:{user_id_feedback_id:{
                    user_id:id,
                    feedback_id:post.feedbacks.id
                }
                }})
                // console.log(feedback)
                if(feedback){
                    var upData = null
                    if(data.unlike && feedback?.liked !=='false'){
                        upData = {unlike:{increment:1}}
                        upData.like = feedback?.liked ==='null'?{decrement:0}:{decrement:1}
                        await prisma.feedback.update({where:{post_id:post.id,user:{some:{user_id:id}}},data:upData})
                        await prisma.userOnFeedback.update({where:{user_id_feedback_id:
                            {user_id:id,
                                feedback_id:feedback.feedback_id
                            }
                        },
                        data:{
                            liked:'false'
                        }
                    })
                        // console.log('data',upData)
                    }
                    else if(data.like && feedback?.liked !=='true'){
                        upData = {like:{increment:1}}
                        upData.unlike = feedback?.liked ==='null'?{decrement:0}:{decrement:1}
                        await prisma.feedback.update({where:{post_id:post.id,user:{some:{user_id:id}}},data:upData})
                        await prisma.userOnFeedback.update({where:{user_id_feedback_id:
                            {user_id:id,
                                feedback_id:feedback.feedback_id
                            }
                        },
                        data:{
                            liked:'true'
                        }
                    })
                        // console.log('data',upData)
                    }
                    else if(data.like===data.unlike && feedback?.liked !=='null' ){
                        upData = feedback?.liked==='true'?{like:{decrement:1}}:{unlike:{decrement:1}}
                        await prisma.feedback.update({where:{post_id:post.id,user:{some:{user_id:id}}},data:upData})
                        await prisma.userOnFeedback.update({where:{user_id_feedback_id:
                            {user_id:id,
                                feedback_id:feedback.feedback_id
                            }
                        },
                        data:{
                            liked:'null'
                        }
                    })
                        // console.log('data',upData)
                        // console.log('same')
                    }
                    
                }
                else{
                    
                }
            }catch(error){
                // console.log("feedback",error)
                if(data.like!==data.unlike){
                    const cr = await prisma.feedback.update({data:{
                        like:data.like?{increment:1}:{increment:0},
                        unlike:data.unlike?{increment:1}:{increment:0},
                            },
                        where:{
                            id:post.feedbacks.id
                        },
                    //     create:{
                    //     user:{
                    //         create:[
                    //             {
                    //                 liked:data.like?'true':'false',
                    //                 user:{
                    //                     connectOrCreate:{
                    //                         id
                    //                     }
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // }
                })
                await prisma.userOnFeedback.create({data:{
                    user_id:id,
                    feedback_id:post.feedbacks.id,
                    liked:data.like?'true':'false',
                }})
                    // console.log("creat",cr)
                    }
                    else{
                        const cr = await prisma.userOnFeedback.create({data:{
                            user_id:id,
                            feedback_id:post.feedbacks.id,
                        }})
                        // console.log("creat",cr)
                    }
            }

            if(data.command){
                try {
                    await prisma.command.create({data:{
                        feedback_id:post.feedbacks.id,
                        user_id:id,
                        text:data.command,
                    }})
                } catch (error) {
                    console.log(error)
                }
            }
        }else{
            try {
                const feedbackData = await prisma.feedback.create({data:{
                    like:data.like?1:0,
                    unlike:data.unlike?1:0,
                    post_id:post.id,
                    user:{
                        create:[
                            {
                                liked:data.like===data.unlike?'null':data.like?'true':'false',
                                user:{
                                    connect:{
                                        id
                                    }
                                }
                            }
                        ]
                    }
                }})
                if(data.command){
                    try {
                        await prisma.command.create({data:{
                            feedback_id:feedbackData.id,
                            user_id:id,
                            text:data.command,
                        }})
                    } catch (error) {
                        console.log(error)
                    }
                }
            } catch (error) {
                console.log(error,'feee')
            }
        }
    } catch (error) {
        console.log(error)
    }
    return Response.json({message:'success',data})
}