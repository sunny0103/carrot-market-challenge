"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { SVG_PATHS } from "@/components/svg-path";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useActionState } from "react";
import { createAccout } from "./actions";

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccout, null);
  return (
    <div
      className="flex flex-col justify-center items-center
    min-h-screen gap-3"
    >
      <div className="flex flex-col justify-center gap-2 *:font-medium ">
        <h1 className="text-2xl">Hello 😃 Welcome to this Website!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
          minLength={3}
          maxLength={10}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
          svgPath={SVG_PATHS.EMAIL}
          svgClassname="size-6 absolute top-4 left-3 text-gray-400"
        />
        <Button text="Create Account" />
      </form>
    </div>
  );
}
