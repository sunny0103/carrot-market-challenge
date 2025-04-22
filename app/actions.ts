"use server";

export async function handleForm(prevState:any, formData: FormData) {

    return {
      errors: ["wrong password", "wrong email"],
    };
  }