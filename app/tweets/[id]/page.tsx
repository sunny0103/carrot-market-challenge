import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";

async function getIsAuthor(authorId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === authorId;
  }
  return false;
}
async function getUser(id: number) {
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
export default async function tweetDetails({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const tweet = await getUser(id);
  if (!tweet) {
    return notFound();
  }
  const isAuthor = await getIsAuthor(tweet.authorId);

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
          <button className="border-2 px-4 py-2 rounded-md font-semibold">
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
