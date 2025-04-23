"use server";
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "@/lib/constants";
import {z} from "zod";

const checkEmail = (email: string) => email.includes("@zod.com");

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmail, "Only zod.com email is allowed"),
  username: z.string().min(5, "Username is too short").max(20, "Username is too long"),
  password: z.string().min(10, "Password must be at least 10 characters")
  .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});

interface ActionState {
  ok:boolean
}

export async function login(prevState: ActionState, formData: FormData) {
  const data ={
    email:formData.get("email"),
    username:formData.get("username"),
    password:formData.get("password"),
  }

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return {
      error:result.error.flatten(),
      ok: false
      };
  } else{
    return {
      ok: true,
    }
  }

}