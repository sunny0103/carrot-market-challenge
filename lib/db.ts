import { PrismaClient } from '../lib/generated/prisma';

const db = new PrismaClient();

// async function test() {
//     const user = await db.user.create({
//         data: {
//             username: "testname",
//             email: "testname@example.com",
//             password: "0000000000"
//         }
       
//     });
//     const tweet = await db.tweet.create({
//         data:{
//             tweet:"Hello Prisma",
//             authorId: user.id
//         },
//         include:{author:true}
//     })

//     const like = await db.like.create({
//         data:{
//             tweetId:tweet.id,
//             userId:user.id
//         },
//         include:{user:true, tweet:true}
//     })


// }

// test()
export default db;
