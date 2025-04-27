"use server";

import { PASSWORD_ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import {z} from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";


const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  username: z.string({required_error:"username is required"}),
  password: z.string({required_error:"Password is required"}),
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
  if(!user){
      ctx.addIssue({
          code:'custom',
          message:"An account with this email does not exist",
          path:["email"],
          fatal:true,
      });
      return z.NEVER;
  }
})
.superRefine(async ({username}, ctx) =>{
  const user = await db.user.findUnique({
      where:{
        username
      },
      select:{
          id:true,
      }
  });
  if(!user){
      ctx.addIssue({
          code:'custom',
          message:"An account with this username does not exist",
          path:["username"],
          fatal:true,
      });
      return z.NEVER;
  }
})

;


export async function login(prevState: any, formData: FormData) {
  const data ={
    email:formData.get("email"),
    username:formData.get("username"),
    password:formData.get("password"),
  }

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      error:result.error.flatten(),
      ok: false
      };
  } else{
    const user = await db.user.findUnique({
      where:{
        email:result.data.email
      },
      select:{
        id:true,
        password:true
      }
    })
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    if(ok){
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile")
    }else{
      return{
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      }
    }
  }

}