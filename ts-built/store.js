var RedisContextStore_1 = require("./RedisContextStore");
var redis = require("redis");
var redisConnection = redis.createClient();
exports.store = RedisContextStore_1.createStore(redisConnection, { safeMode: true });
exports.getContext = function (contextKey) { return exports.store.getContext(contextKey); };
exports.default = exports.store;
