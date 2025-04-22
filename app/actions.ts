"use server";

interface ActionResult {
  ok: boolean;
  errors?: {
    password?: string[];
  };
}

export async function handleForm(prevState: any, formData: FormData): Promise<ActionResult> {
  const password = formData.get('password') as string;
  const correctPassword = "12345"; 

  if (!password || password !== correctPassword) {
    return {
      ok: false,
      errors: {
        password: ["Wrong password!"]
      }
    };
  }

  return {
    ok: true
  };
}