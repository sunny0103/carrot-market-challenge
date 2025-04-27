"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { SVG_PATHS } from "@/components/svg-path";
import { useActionState } from "react";
import "@/lib/db";
import { login } from "./actions";

export default function LogIn() {
  const [state, dispatch] = useActionState(login, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-10">
      <span className="text-5xl font-extrabold"> Welcome </span>
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
    </div>
  );
}
