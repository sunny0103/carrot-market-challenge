"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";


const tweetSchema = z.object({
    tweet:z.string({required_error:"Tweet is required"}).min(3,"Too short").max(120,"It is too long"),
})

export async function uploadTweet(_:any, formData:FormData) {
    const data={
        tweet:formData.get("tweet")
    };
    
    const result = await tweetSchema.safeParse(data);
    if(!result.success){
        return result.error.flatten();
    }else{
        const session = await getSession();
        if(session.id){
            const tweet = await db.tweet.create({
                data:{
                    tweet:result.data.tweet,
                    author:{
                        connect:{
                            id:session.id
                        }
                    }
                },
                select:{
                    id:true
                }
            });
     
            await session.save();
            redirect("/");
        }
    }

}
