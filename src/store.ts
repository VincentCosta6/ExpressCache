import { createStore } from "./RedisContextStore"

let redis = require("redis");

const redisConnection = redis.createClient();

export const store = createStore(redisConnection, { safeMode: true });

export const getContext = contextKey => store.getContext(contextKey);

export default store;