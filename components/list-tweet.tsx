import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface ListTweetProps {
  tweet: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  id: number;
}

export default function ListTweet({
  tweet,
  createdAt,
  updatedAt,
  author,
  id,
}: ListTweetProps) {
  return (
    <Link href={`/tweets/${id}`}>
      <div className="flex gap-3 items-center">
        <div className="bg-neutral-500 w-8 h-8 rounded-full" />
        <span className="mr-3 font-semibold">{author}</span>
        {updatedAt !== null ? (
          <span className="text-xs text-neutral-300">
            {formatToTimeAgo(updatedAt.toString())}
          </span>
        ) : (
          <span className="text-xs text-neutral-300">
            {formatToTimeAgo(createdAt.toString())}
          </span>
        )}
        <div className="bg-neutral-500 w-5 h-5 rounded-full" />
      </div>
      <div className="ml-10 mt-1">
        <p>{tweet}</p>
      </div>
    </Link>
  );
}
