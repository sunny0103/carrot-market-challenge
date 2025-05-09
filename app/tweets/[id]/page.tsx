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
import NavigationBar from "@/components/navbar";
import Trends from "@/components/trends";
import Link from "next/link";

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
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="w-[22vw] mt-[10vh] h-screen border-l border-gray-800 fixed right-0 gap-5">
        <span className="flex justify-center text-2xl font-extrabold">
          Trends For you
        </span>
        <Trends
          trend_type="# Breaking News"
          src={"/breaking-news.jpg"}
          alt="Breaking News"
          desc="Latest updates on trending topics and news..."
          trend_info="100,000 people are Tweeting about this "
        />
        <Trends
          trend_type="# Local News"
          src={"/local_news.jpg"}
          alt="Local News"
          desc="Latest updates on trending local news..."
          trend_info="150,600 people are Tweeting about this "
        />
        <Trends
          trend_type="# Breaking News"
          src={"/news.jpg"}
          alt="Breaking News"
          desc="Latest updates on trending topics and news..."
          trend_info="103,000 people are Tweeting about this "
        />
      </div>
      {/* main page */}
      <div className="flex flex-col mr-[25vw] ml-[7vw] mt-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <UserIcon className="w-10 h-10" />
            <Link
              href={`/users/${tweet.author.username}`}
              className="px-5 py-3 bg-blue-500 rounded-md"
            >
              <span className="uppercase font-semibold">
                About {tweet.author.username}
              </span>
            </Link>
          </div>

          <div className="flex gap-5">
            <span>{tweet.author.username}</span>
            <span>{formatToTimeAgo(tweet.createdAt.toString())}</span>
          </div>

          <div className="flex items-center gap-10">
            <p>{tweet.tweet}</p>
            {isAuthor ? (
              <button className="border-2 px-4 py-2 rounded-md text-sm font-semibold">
                Delete
              </button>
            ) : null}
          </div>
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            tweetId={tweetId}
          />
        </div>

        <AddComments
          tweetId={tweetId}
          initialComments={comments.map((comment) => ({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
