import Link from "next/link";
import Image from "next/image";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import TweetList from "@/components/tweet-list";
import { TWEETLIST_NUMS } from "@/lib/constants";
import Trends from "@/components/trends";

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
}

async function getInitialTweets() {
  const tweets = db.tweet.findMany({
    select: {
      tweet: true,
      createdAt: true,
      updatedAt: true,
      author: true,
      id: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    take: TWEETLIST_NUMS,
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
}

async function getTotalTweetCount() {
  return await db.tweet.count();
}

export type InitialTweets = Awaited<ReturnType<typeof getInitialTweets>>;

export default async function Home() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/login");
  };
  const initialTweets = await getInitialTweets();
  const totalTweetCout = await getTotalTweetCount();
  const totalPages = Math.ceil(totalTweetCout / TWEETLIST_NUMS);
  return (
    <div className="min-h-screen flex">
      {/* left side */}
      <div className="w-[20vw] mt-10 h-screen fixed left-0 gap-5 border-r-1 border-gray-600">
        <span className="flex justify-center text-5xl mb-5">🐦</span>
        <span className="flex justify-center text-xl font-extrabold mb-5">
          Welcome {user?.username}
        </span>
        <div className="flex *:gap-4 justify-center">
          <Link
            href={`/users/${user?.username}`}
            className="flex gap-4 text-xl bg-transparent font-semibold  hover:bg-neutral-700 hover:rounded-2xl  transition-colors  ease-in-out p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            Profile
          </Link>
        </div>
        <div className="flex *:gap-4 justify-center">
          <form action={logOut}>
            <button className="flex gap-4 text-xl bg-transparent border-2 border-transparent font-semibold  hover:bg-neutral-700 hover:rounded-2xl transition-colors  ease-in-out p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              Log out
            </button>
          </form>
        </div>
        <div className="flex *:gap-4 justify-center">
          <Link
            href={"/search"}
            className="flex bg-transparent text-xl border-2 border-transparent font-semibold hover:bg-neutral-700 hover:rounded-2xl transition-colors  ease-in-out p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            Search
          </Link>
        </div>
        <div className="flex *:gap-4 justify-center mt-10">
          <Link
            href="/add"
            className="flex px-12 bg-blue-500 text-2xl rounded-2xl font-semibold hover:bg-blue-600 transition-colors  ease-in-out p-3"
          >
            Add Tweet
          </Link>
        </div>
      </div>
      {/* left info page */}
      <div className="w-[22vw] mt-10 h-screen border-l border-gray-600 fixed right-0 gap-5">
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
      <div className="flex-1 ml-[22vw] mr-[24vw] h-screen m-5">
        <div className="relative w-full h-[20vh] border-2 rounded-2xl">
          <Image
            src={"/home_img.jpg"}
            alt=""
            fill
            className="object-cover opacity-75 rounded-md p-3"
            priority
          />
          <span className="absolute top-3 left-3 font-semibold italic text-5xl">
            Home
          </span>
        </div>
        <div className="mt-10">
          <TweetList initialTweets={initialTweets} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
