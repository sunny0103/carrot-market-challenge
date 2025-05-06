"use client";

import { InitialTweets } from "@/app/(home)/page";
import { useState } from "react";
import ListTweet from "./list-tweet";
import { getMoreLists } from "@/app/(home)/actions";

interface TweetListProps {
  initialTweets: InitialTweets;
}
export default function TweetList({ initialTweets }: TweetListProps) {
  const [tweets, setTweets] = useState(initialTweets);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const onLoadPrev = async () => {
    if (page <= 1) return;
    setIsLoading(true);
    const prevLists = await getMoreLists(page - 1);
    setPage((prev) => prev - 1);
    setTweets((prev) => [...prev, ...prevLists]);
    setIsLoading(false);
  };

  const onLoadNext = async () => {
    setIsLoading(true);
    const nextLists = await getMoreLists(page + 1);
    setPage((prev) => prev + 1);
    setTweets(nextLists);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col mb-5">
        {tweets.map((tweet) => (
          <ListTweet key={tweet.id} {...tweet} author={tweet.author.username} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onLoadPrev}
          disabled={page <= 1 || isLoading}
          className={`px-4 py-2 rounded-lg font-semibold
            ${
              page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
        >
          {isLoading ? "Loading..." : "← Previous"}
        </button>

        <button onClick={onLoadNext}>
          {isLoading ? "Loading..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
