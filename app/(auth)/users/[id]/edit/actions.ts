"use server";

import { PASSWORD_ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcrypt";

const checkEmail = (email: string) => email.includes("@zod.com");

const editSchema = z.object({
    username: z.string().trim()
    .min(USERNAME_MIN_LENGTH, "Username is too short")
    .max(20, "Username is too long"),
    bio:z.string().trim().max(20,"Too long").nullable(),
    email: z.string().email().toLowerCase().refine(checkEmail,"Only zod.com email is allowed"),
    password: z.string().min(PASSWORD_MIN_LENGTH,"Too short").regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE).optional(),
    confirm_password: z.string().optional()

})
.superRefine(async({username, email, password, confirm_password},ctx) =>{
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

    if(password){
        if(!confirm_password){
            ctx.addIssue({
                code:"custom",
                message:"Plase confirm your password",
                path:["confirm_password"]
            })
        }else if(password !==confirm_password){
            ctx.addIssue({
                code:"custom",
                message:"Password does not match",
                path:["confirm_password"]
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
            bio:true,
            password:true,
        }});
    return user;
}

export async function editProfile(prevState:any, formData:FormData) {
    const session = await getSession();

    const data={
        username:formData.get("username"),
        bio:formData.get("bio"),
        email:formData.get("email"),
        password:formData.get("password")||undefined,
        confirm_password:formData.get("confirm_password")||undefined

    }
    const result = await editSchema.safeParseAsync(data);

    if(!result.success){
        return result.error.flatten();
    }else{
        const updateData ={
            ...result.data,
        }

        if(result.data.password){
              updateData.password = await bcrypt.hash(result.data.password, 12);
              
        }

        delete updateData.confirm_password;
        
        await db.user.update({
            where:{
                id:session.id
            },
            data:updateData
    })
    
    // const currentSession = await getSession();
    // await currentSession.save();
    revalidatePath(`/users/${result.data.username}`)

}
}



