"use server";

import { PASSWORD_ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const checkEmail = (email: string) => email.includes("@zod.com");

const editSchema = z.object({
    username: z.string().trim()
    .min(USERNAME_MIN_LENGTH, "Username is too short")
    .max(20, "Username is too long"),
    bio:z.string().trim().max(20,"Too long").nullable(),
    email: z.string().email().toLowerCase().refine(checkEmail,"Only zod.com email is allowed"),

})
.superRefine(async({username, email},ctx) =>{
    const session = await getSession();
    if (!session.id) return ;

    const currentUser = await db.user.findUnique({
        where:{
            id:session.id
        },
        select:{
            username:true,
            email:true
        }
    })

    if(username !== currentUser?.username){
        const existUser = await db.user.findFirst({
            where:{
                username,
                NOT:{id:session.id}
            }
        });

        if(existUser){
            ctx.addIssue({
                code:'custom',
                message:"This username is already taken",
                path:["username"]
            })
        }
    }

    if(email!==currentUser?.email){
        const existUser = await db.user.findFirst({
            where:{
                email,
                NOT:{id:session.id}
            }
        });

        if(existUser){
            ctx.addIssue({
                code:'custom',
                message:"This email is already taken",
                path:["email"]
            })
        }
    }


})

export async function getUserProfile(username:string) {
    const session = await getSession();
    if(!session.id) return null;

    const user = db.user.findUnique({
        where:{
            username
        },
        select:{
            username:true,
            email:true,
            bio:true
        }});
    return user;
}

export async function editProfile(prevState:any, formData:FormData) {
    const session = await getSession();

    const data={
        username:formData.get("username"),
        bio:formData.get("bio"),
        email:formData.get("email"),

    }
    const result = await editSchema.safeParseAsync(data);

    if(!result.success){
        return result.error.flatten();
    }else{
        await db.user.update({
            where: {
                id: session.id
            },
            data: result.data
        })
    }
    revalidatePath(`/users/${result.data.username}`)

}




