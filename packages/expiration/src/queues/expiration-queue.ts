import Queue from "bull";

const expirationQueue = new Queue("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});
