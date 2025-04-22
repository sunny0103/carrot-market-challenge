"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { SVG_PATHS } from "@/components/svg-path";
import { useActionState } from "react";
import { handleForm } from "./actions";

export default function HomeLogIn() {
  const [state, action] = useActionState(handleForm, null);
  console.log(state);
  console.log(action);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-10">
      <span className="text-5xl">😺 Welcome 👋</span>
      <form
        action={action}
        className="w-full max-w-md *:font-medium gap-5 flex flex-col"
      >
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={[]}
          svgPath={SVG_PATHS.USER}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
          svgPath={SVG_PATHS.PASSWORD}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
      </form>
      <FormButton text="Log In" />
    </div>
  );
}
