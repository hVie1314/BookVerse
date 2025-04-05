const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const CONNECTION_REDIS_URL = process.env.CONNECTION_REDIS_URL;

const redisClient = redis.createClient({
  url: CONNECTION_REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

async function connect() {
  try {
    await redisClient.connect();
    console.log("Connect to Redis successfully!!!");
  } catch (err) {
    console.error("Error connecting to Redis server: ", err);
    process.exit(1);
  }
};

module.exports = { redisClient, connect };
