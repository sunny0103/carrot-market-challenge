"use client";

import { dislikeTweet, likeTweet } from "@/app/tweets/[id]/actions";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useOptimistic, useTransition } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}
export default function LikeButton({
  isLiked,
  likeCount,
  tweetId,
}: LikeButtonProps) {
  const [ispending, startTransition] = useTransition();
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );
  const onClick = async () => {
    startTransition(async () => {
      reducerFn(undefined);
      if (isLiked) {
        await dislikeTweet(tweetId);
      } else {
        await likeTweet(tweetId);
      }
    });
  };
  return (
    <button
      onClick={onClick}
      className="flex mt-3 items-center gap-2  text-sm  "
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="w-5 h-5" />
      ) : (
        <OutlineHandThumbUpIcon className="w-5 h-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>Like?({state.likeCount})</span>
      )}
    </button>
  );
}
