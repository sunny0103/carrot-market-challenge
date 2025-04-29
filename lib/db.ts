import { PrismaClient } from '../lib/generated/prisma';

const db = new PrismaClient();

// async function test() {

//     const tweet = await db.tweet.create({
//         data:{
//             tweet:"Hello NextJS",
//             authorId: 6
//         },
//         include:{author:true}
//     })

//     const like = await db.like.create({
//         data:{
//             tweetId:tweet.id,
//             userId:6
//         },
//         include:{user:true, tweet:true}
//     })


// }

// test()




// import bcrypt from "bcrypt";

// async function test() {
//   const password = await bcrypt.hash("1212", 12);


//   const users = await Promise.all(
//     Array.from({ length: 10 }).map((_, i) =>
//       db.user.create({
//         data: {
//           username: `user${i + 1}`,
//           email: `test${i + 1}@zod.com`,
//           password,
//         },
//       })
//     )
//   );

  // 2. 트윗 생성 (유저마다 2개씩)
//   const tweets = await Promise.all(
//     users.flatMap((user) =>
//       Array.from({ length: 2 }).map((_, i) =>
//         db.tweet.create({
//           data: {
//             tweet: `Hello from ${user.username}, tweet #${i + 1}`,
//             authorId: user.id,
//           },
//         })
//       )
//     )
//   );

//   // 3. 좋아요 생성 (랜덤하게 다른 유저들이 좋아요 누름)
//   for (const tweet of tweets) {
//     const numberOfLikes = Math.floor(Math.random() * 5) + 1; // 1~5개 좋아요
//     const shuffledUsers = users.sort(() => 0.5 - Math.random());
//     const likingUsers = shuffledUsers.slice(0, numberOfLikes);

//     await Promise.all(
//       likingUsers.map((user) =>
//         db.like.create({
//           data: {
//             userId: user.id,
//             tweetId: tweet.id,
//           },
//         })
//       )
//     );
//   }

//   console.log("✅ Test data created!");
// }

// test().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });


export default db;
