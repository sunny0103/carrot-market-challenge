"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { SVG_PATHS } from "@/components/svg-path";
import { useActionState } from "react";
import { login } from "./actions";

const initialState = {
  ok: false,
  fieldErrors: {
    email: [],
    username: [],
    password: [],
  },
};
export default function HomeLogIn() {
  const [state, dispatch] = useActionState(login, initialState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-10">
      <span className="text-5xl"> ✨ Welcome ✨</span>
      <form
        action={dispatch}
        className="w-full max-w-md *:font-medium gap-5 flex flex-col"
      >
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.error?.fieldErrors?.email}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.error?.fieldErrors?.username}
          svgPath={SVG_PATHS.USER}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.error?.fieldErrors?.password}
          svgPath={SVG_PATHS.PASSWORD}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Button text="Log In" />
      </form>
      {state.ok ? (
        <div className="flex rounded-2xl bg-green-500 text-white font-medium h-12  items-center justify-center text-center transition-colors w-md">
          Success Log In
        </div>
      ) : null}
    </div>
  );
}
