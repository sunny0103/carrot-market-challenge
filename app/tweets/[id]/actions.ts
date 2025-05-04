"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function likeTweet(tweetId:number) {
    const session = await getSession();
    try{
        await db.like.create({
            data:{
                tweetId:tweetId,
                userId:session.id!
            }
        })
        revalidateTag(`like-status-${tweetId}`)
    }catch(e){}
}

export async function dislikeTweet(tweetId:number) {
    const session = await getSession();
    try{
        await db.like.delete({
            where:{
                userId_tweetId:{
                    tweetId:tweetId,
                    userId:session.id!
                }
            }
        })
        revalidateTag(`like-status-${tweetId}`)
    }catch(e){}
}

const commentSchema = z.object({
    comment:z.string({required_error: "Comment is required"})
    .min(2,"Too short").max(120, "It is too long"),
    tweetId: z.string()

})

export async function tweetComment(_:any, formData:FormData) {
    const data = {
        comment:formData.get("comment"),
        tweetId: formData.get("tweetId")
    }
    const result = await commentSchema.safeParse(data);
    if(!result.success){
        return result.error.flatten()
    }
    const session = await getSession();
    if(!session.id) return;
    try{
        await db.comment.create({
            data:{
                content:result.data.comment,
                tweet:{
                    connect:{
                        id:parseInt(result.data.tweetId,10)
                    }
                },
                author:{
                    connect:{
                        id:session.id
                    }
                }
            }
        });
        await session.save();
        revalidateTag(`like-status-${result.data.tweetId}`);
    }catch(e){

    }
}
