import { createStore } from "../src/RedisContextStore"

let redis = require("redis");

const redisConnection = redis.createClient();

export const store = createStore(redisConnection, { safeMode: true });

// For convenience so we can use import { getContext } from "./store"
export const getContext = contextKey => store.getContext(contextKey);

export default store;