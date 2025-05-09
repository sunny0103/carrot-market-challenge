"use server";

import { TWEETLIST_NUMS } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreLists(page:number) {
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
                comments: true
            }
        },
      },
        take: TWEETLIST_NUMS,
        skip:(page-1) *TWEETLIST_NUMS,
        orderBy: {
          createdAt: "desc",
        },
      });
      return tweets;
    
}