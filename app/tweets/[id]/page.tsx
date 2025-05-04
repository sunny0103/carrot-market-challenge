import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/like-button";
import { useActionState } from "react";
import { tweetComment } from "./actions";
import AddComments from "@/components/add-comments";

async function getIsAuthor(authorId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === authorId;
  }
  return false;
}

async function getTweet(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
  return tweet;
}

const getcachedTweet = nextCache(getTweet, ["tweet-detail"], {
  tags: ["tweet-detail"],
});

async function getLikeStatus(tweetId: number, userId: number) {
  const isliked = await db.like.findUnique({
    where: {
      userId_tweetId: {
        userId,
        tweetId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isliked),
  };
}

async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["tweet-like-status"], {
    tags: [`like-status-${tweetId}`],
  });
  if (!userId) return { likeCount: 0, isLiked: false };
  return cachedOperation(tweetId, userId);
}

export default async function tweetDetails({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;
  const tweetId = Number(id);

  if (isNaN(tweetId)) {
    return notFound();
  }

  const tweet = await getcachedTweet(tweetId);
  if (!tweet) {
    return notFound();
  }
  const isAuthor = await getIsAuthor(tweet.authorId);
  const { likeCount, isLiked } = await getCachedLikeStatus(tweetId);
  const comments = await db.comment.findMany({
    where: {
      tweetId: tweetId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="m-10">
      <div className="flex gap-3">
        <UserIcon className="w-10 h-10" />
        <span>{tweet.author.username}</span>
        <span>{formatToTimeAgo(tweet.createdAt.toString())}</span>
      </div>
      <div className="ml-12 flex items-center gap-10">
        <p>{tweet.tweet}</p>
        {isAuthor ? (
          <button className="border-2 px-4 py-2 rounded-md text-sm font-semibold">
            Delete
          </button>
        ) : null}
      </div>
      <LikeButton isLiked={isLiked} likeCount={likeCount} tweetId={tweetId} />
      <AddComments
        tweetId={tweetId}
        initialComments={comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
