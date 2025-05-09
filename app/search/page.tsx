"use client";

import { useActionState } from "react";
import { searchTweet } from "./actions";
import ListTweet from "@/components/list-tweet";
import Link from "next/link";

export default function search() {
  const [state, dispatch] = useActionState(searchTweet, null);
  return (
    <div className="flex flex-col min-h-full">
      {/* Search area */}
      <form action={dispatch} className="flex justify-center mt-10 gap-5">
        <input
          name="search"
          type="text"
          className="bg-gray-50 border border-gray-300 
        text-gray-900 text-sm rounded-lg focus:ring-blue-500 
        focus:border-blue-500 block w-[40vw] p-2.5"
          placeholder="Search here"
          required
        />

        <button className="bg-blue-800 hover:bg-blue-600 py-3 px-10 rounded-md transition-colors ease-in-out">
          Search
        </button>
        <Link
          href="/"
          className="bg-blue-800 px-10 py-3 rounded-md hover:bg-blue-600 transition-colors ease-in-out"
        >
          Home
        </Link>
      </form>
      {/* error */}
      {state?.error?.fieldErrors.search && (
        <p className="flex justify-center text-sm text-red-500 -mt-3">
          {state.error.fieldErrors.search}
        </p>
      )}
      <div className="ml-[20vw] mr-[20vw] mt-8">
        {state?.tweets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center -ml-[20vw] gap-2">
            <span className="text-2xl text-neutral-300">No tweets found</span>
            <span className="text-xl text-neutral-300">
              Try searching with different keywords
            </span>
          </div>
        ) : (
          state?.tweets?.map((tweet) => (
            <ListTweet
              likes={tweet._count.likes}
              comments={tweet._count.comments}
              key={tweet.id}
              {...tweet}
              author={tweet.author.username}
            />
          ))
        )}
      </div>
    </div>
  );
}
