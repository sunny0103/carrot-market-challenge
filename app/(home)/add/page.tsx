"use client";

import Input from "@/components/input";
import { SVG_PATHS } from "@/components/svg-path";
import { useActionState } from "react";
import { uploadTweet } from "./actions";

export default function AddTweets() {
  const [state, action] = useActionState(uploadTweet, null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-[50%] max-w-2xl">
        <form
          action={action}
          className="flex flex-col gap-5 p-8 border-2 rounded-xl"
        >
          <Input
            name="tweet"
            type="text"
            placeholder="Got something to share?"
            required
            svgPath={SVG_PATHS.TWEET}
            svgClassname="size-6 absolute top-4 left-3 text-gray-400"
            errors={state?.fieldErrors.tweet}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Share Tweet
          </button>
        </form>
      </div>
    </div>
  );
}
