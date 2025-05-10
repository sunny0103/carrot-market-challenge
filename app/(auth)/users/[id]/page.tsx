import NavigationBar from "@/components/navbar";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

import { BellAlertIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Trends from "@/components/trends";
import Link from "next/link";
import ListTweet from "@/components/list-tweet";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function isCurrentUser(username: string) {
  const session = await getSession();
  if (!session.id) return false;

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  return user?.username === username;
}

async function getTweet(id: string) {
  const tweets = await db.tweet.findMany({
    where: {
      author: {
        username: id,
      },
    },
    include: {
      author: {
        select: {
          username: true,
          id: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
}
export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const isOwner = await isCurrentUser(id);
  const tweets = await getTweet(id);
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="w-[20vw] mt-[10vh] h-screen border-l border-gray-800 fixed right-0 gap-5">
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
      <div className="flex flex-col mr-[25vw] ml-[8vw]">
        <div className="relative flex w-[65vw]">
          <div className="w-full h-[20vw] bg-neutral-300 aspect-square flex items-center justify-center">
            <PhotoIcon className="text-neutral-600 w-20 h-20" />
          </div>
          <div className="absolute -bottom-12 left-15 w-50 h-50 bg-neutral-400 rounded-full flex items-center justify-center">
            <PhotoIcon className="w-20 h-20 text-neutral-600" />
          </div>
          <div className="relative flex justify-end ">
            {isOwner ? (
              <div className="absolute -bottom-13 right-40">
                <Link
                  href={`/users/${user.username}/edit`}
                  className="px-12 py-3 font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </Link>
              </div>
            ) : (
              <div className="absolute -bottom-15 right-40">
                <button className="px-8 py-2 font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Following
                </button>
              </div>
            )}
            <div className="absolute -bottom-15 -right-0 rounded-md bg-blue-500 px-10">
              <BellAlertIcon className="w-10 h-10" />
            </div>
          </div>
        </div>
        <div className="mt-[7vh]">
          <h1 className="text-2xl font-bold">
            {isOwner ? "Welcome" : ""} {user?.username} 😃
          </h1>
          <span>
            {user.email.match(/@.*/)
              ? user.email.match(/@.*/)
              : `@${user.username}}`}
          </span>
        </div>
        <div className="border-b-2 border-neutral-600 my-5 mr-[7vw]" />
        <div>
          <h2 className="text-3xl mb-3">Tweets</h2>
          {tweets.map((tweet) => (
            <ListTweet
              key={tweet.id}
              tweet={tweet.tweet}
              createdAt={tweet.createdAt}
              updatedAt={tweet.updatedAt}
              author={tweet.author.username}
              likes={tweet._count.likes}
              comments={tweet._count.comments}
              id={tweet.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
