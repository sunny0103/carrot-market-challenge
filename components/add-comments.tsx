"use client";

import { tweetComment } from "@/app/tweets/[id]/actions";
import { useOptimistic, useRef, useTransition } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { formatToTimeAgo } from "@/lib/utils";

interface CommentProps {
  id?: number;
  content: string;
  tweetId: number;
  createdAt?: string;
}

interface AddCommentsProps {
  tweetId: number;
  initialComments?: CommentProps[];
}

export default function AddComments({
  tweetId,
  initialComments = [],
}: AddCommentsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [optComments, addComment] = useOptimistic(
    initialComments,
    (state: CommentProps[], newComment: CommentProps) => [newComment, ...state]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;

    if (!comment) return;

    const newComment = {
      content: comment,
      tweetId,
      createdAt: new Date().toISOString(),
    };

    startTransition(async () => {
      addComment(newComment);
      await tweetComment(null, formData);

      formRef.current?.reset();
    });
  };
  return (
    <div className="flex flex-col gap-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative w-full mt-4"
      >
        <input type="hidden" name="tweetId" value={tweetId} />
        <div className="relative">
          <input
            name="comment"
            type="text"
            placeholder="Write a comment..."
            className={`w-full px-4 py-2 pr-12 rounded-lg bg-neutral-800 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isPending ? "opacity-50" : ""}`}
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 
          hover:text-blue-500 transition-colors
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-4">
        {optComments.map((comment, index) => (
          <div
            key={comment.id || `temp-${index}`}
            className="p-4 rounded-lg bg-neutral-800"
          >
            <p className="text-white">{comment.content}</p>
            {comment.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                {formatToTimeAgo(comment.createdAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
