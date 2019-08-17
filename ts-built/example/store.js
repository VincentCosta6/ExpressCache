var RedisContextStore_1 = require("../src/RedisContextStore");
var redis = require("redis");
var redisConnection = redis.createClient();
exports.store = RedisContextStore_1.createStore(redisConnection, { safeMode: true });
// For convenience so we can use import { getContext } from "./store"
exports.getContext = function (contextKey) { return exports.store.getContext(contextKey); };
exports.default = exports.store;
