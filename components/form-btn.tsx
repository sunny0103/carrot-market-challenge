"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}
export default function FormButton({ text }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="disabled:bg-neutral-400 
    diabled:cursor-not-allowed rounded-2xl bg-green-500 text-white font-medium h-12
    text-center hover:bg-purple-500 transition-colors w-md"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
