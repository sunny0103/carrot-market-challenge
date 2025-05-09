import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ListTweetProps {
  tweet: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  id: number;
  likes: number;
  comments: number;
}

export default function ListTweet({
  tweet,
  createdAt,
  updatedAt,
  author,
  id,
  likes,
  comments,
}: ListTweetProps) {
  return (
    <Link href={`/tweets/${id}`} className="mb-3">
      <div className="bg-neutral-700 rounded-lg p-4 mb-4 hover:bg-neutral-700 transition-colors">
        <div className="flex gap-3 items-center mb-3">
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
        </div>

        <div className="flex gap-3 items-center mb-5">
          <p>{tweet}</p>
        </div>
        <div className="flex gap-5">
          <span className="flex gap-1 items-center">
            <HandThumbUpIcon className="w-6 h-6" />
            {likes}
          </span>
          <span className="flex gap-1 items-center">
            <ChatBubbleBottomCenterIcon className="w-6 h-6" />
            {comments}
          </span>
        </div>
      </div>
    </Link>
  );
}
