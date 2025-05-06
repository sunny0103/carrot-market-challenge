import Link from "next/link";
import Image from "next/image";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import TweetList from "@/components/tweet-list";
import { TWEETLIST_NUMS } from "@/lib/constants";

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
      likes: true,
      id: true,
    },
    take: TWEETLIST_NUMS,
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
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
  return (
    <div className="min-h-screen flex">
      {/* left side */}
      <div className="w-[15vw] mt-10 h-screen border-r border-gray-800 fixed left-0 gap-5">
        <span className="flex justify-center text-5xl mb-5">🐦</span>
        <span className="flex justify-center text-xl font-extrabold mb-5">
          Welcome {user?.username}
        </span>
        <div className="flex *:gap-4 justify-center">
          <Link
            href={"/profile"}
            className="flex bg-transparent text-xl border-2 border-transparent font-semibold hover:bg-neutral-700 hover:rounded-2xl transition-colors  ease-in-out p-3"
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
      </div>
      {/* main page */}
      <div className="flex-1 ml-[15vw] h-screen m-5">
        <div className="relative w-full h-[20vh] border-2 rounded-2xl">
          <Image
            src={"/home_img.jpg"}
            alt=""
            fill
            className="object-cover opacity-75 rounded-md p-3"
            priority
          />
          <span className="absolute top-3 left-3 font-semibold italic text-5xl">
            All Tweets
          </span>
        </div>
        <div className="flex-1 m-10">
          <Link
            href="/add"
            className="absolute z-[9999] top-40 right-15 items-center border-2 px-6 py-8 rounded-md text-xl font-bold italic ml-4 bg-neutral-900"
          >
            Add Tweet
          </Link>
          <TweetList initialTweets={initialTweets} />
        </div>
      </div>
    </div>
  );
}
