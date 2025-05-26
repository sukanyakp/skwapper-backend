import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("redis connected"); 
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
})();

export default redisClient;
