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
      Like: true,
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
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center gap-10 p-3">
        <span className="items-center border-2 px-2 py-8 rounded-full text-xs font-bold italic ml-4">
          Tweet & Likes
        </span>
        <div className="w-[75vw] h-[20vh] relative p-4 border-2 rounded-2xl">
          <div className="relative w-full h-full ">
            <Image
              src={"/home_img.jpg"}
              alt=""
              fill
              className="object-cover opacity-75 rounded-md "
              priority
            />
            <span className="absolute top-3 left-3 font-semibold italic text-4xl">
              Welcome {user?.username}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 mr-5">
          <div className="flex justify-center text-xl">
            <Link
              href={"/profile"}
              className="bg-transparent border-2 border-transparent font-semibold hover:border-white hover:rounded-2xl transition-all  ease-in-out p-3"
            >
              Profile
            </Link>
          </div>
          <form action={logOut}>
            <button className="text-xl bg-transparent border-2 border-transparent font-semibold  hover:border-white hover:rounded-2xl transition-all  ease-in-out p-3">
              Log out
            </button>
          </form>
        </div>
      </div>
      <div className="flex-1 m-10">
        <TweetList initialTweets={initialTweets} />
      </div>
    </div>
  );
}
