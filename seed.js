// seed.js — load 100 fake posts into the leaderboard.
// Run with: npm run seed

import { redis } from "./leaderboard.js";

async function seed() {
  try {
    await redis.del("trending:posts");

    // Use one pipeline for the 200 metadata and sorted-set writes.
    const pipeline = redis.pipeline();
    for (let i = 1; i <= 100; i++) {
      const postId = `post:${i}`;
      pipeline.hset(`${postId}:meta`, "title", `Post number ${i}`, "author", `@user${i}`);
      pipeline.zadd("trending:posts", Math.floor(Math.random() * 50), postId);
    }
    await pipeline.exec();
    console.log("Seeded 100 posts.");
  } finally {
    redis.disconnect();
  }
}

seed().catch((error) => {
  console.error("Failed to seed leaderboard:", error);
  process.exitCode = 1;
});
