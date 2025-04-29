"use server";

import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX, PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import {z} from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmail = (email: string) => email.includes("@zod.com");
const checkPassword = ({password, confirm_password}:{password:string, confirm_password:string}) => password === confirm_password;

const formSchema = z.object({
  username: z.string().trim().min(USERNAME_MIN_LENGTH, "Username is too short").max(20, "Username is too long"),
  email: z.string().email().toLowerCase().refine(checkEmail,"Only zod.com email is allowed"),
  password: z.string().min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters")
  .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
  confirm_password: z.string().min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters")
  .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
})
.superRefine(async({username},ctx) =>{
    const user = await db.user.findUnique({
        where:{
            username
        },
        select:{
            id:true
        }
    });
    if(user){
        ctx.addIssue({
            code:'custom',
            message:"This username is already taken",
            path:["username"],
            fatal:true
        });
        return z.NEVER;
    }
})
.superRefine(async ({email}, ctx) =>{
    const user = await db.user.findUnique({
        where:{
            email
        },
        select:{
            id:true,
        }
    });
    if(user){
        ctx.addIssue({
            code:'custom',
            message:"This email is already taken ",
            path:["email"],
            fatal:true,
        });
        return z.NEVER;
    }
})
.refine(checkPassword, {
    message:"Passwords don't match",
    path:["confirm_password"],
});
;



export async function createAccout(prevState: any, formData: FormData) {
  const data ={
    username:formData.get("username"),
    email:formData.get("email"),
    password:formData.get("password"),
    confirm_password :formData.get("confirm_password"),
  }

const  result = await formSchema.safeParseAsync(data); 
// console.log(result.error?.flatten());
if(!result.success) {
    return result.error.flatten();
}else{
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
        data:{
            username:result.data.username,
            email:result.data.email,
            password:hashedPassword,
        },
        select:{
            id:true
        }
    })
    
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/");
}
}
