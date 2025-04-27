"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}
export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="disabled:bg-neutral-400 
    diabled:cursor-not-allowed rounded-2xl bg-green-600 text-white font-medium h-12
    text-center hover:bg-purple-500 transition-colors w-md"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
