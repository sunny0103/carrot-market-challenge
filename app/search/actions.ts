"use server";

import db from "@/lib/db";
import { error } from "console";
import { z } from "zod";

const searchFormSchema = z.object({
    search:z.string({required_error:"This field is required"})
    .min(3,"Too short")
    .max(20, "It is too long")
})
export async function searchTweet(_:any, formData:FormData) {
    const data={
        search:formData.get("search")
    }

    const result = await searchFormSchema.safeParseAsync(data);
    if(!result.success){
        return {
            error:result.error.flatten(),
            tweet:[]
        };
    }else{
        const tweets = await db.tweet.findMany({
            where:{
                tweet: {
                    contains: result.data.search,
                }
            },
            select:{
                id:true,
                tweet:true,
                createdAt:true,
                updatedAt:true,
                author:{
                    select:{
                        username:true,
                        id:true
                    }
                },
                _count:{
                    select:{
                        likes:true,
                        comments:true
                    }
                }
            },
            orderBy:{
                updatedAt:"desc"
            }
        })
        // console.log("search term", data);
        // console.log("In DB",tweets);
        return{
            tweets,
            error:null
        }
 

    }
  
}