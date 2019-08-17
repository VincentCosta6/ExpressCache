var redis = require("redis");
var RedisContextStore_1 = require("./RedisContextStore");
var redisConnection = redis.createClient();
var connector = RedisContextStore_1.createStore(redisConnection, { safeMode: true });
exports.createContext = function (key, passIns, DBCall) {
    return connector.createContext(key, passIns, DBCall);
};
/*
function wrapper(query, cb) {
    return new Promise(function(resolve, reject) {
        cb(query, resolve, reject);
    })
}

function extractKey(key) {
    let realKey;

    if(typeof key === "function") realKey = key(req);
    else realKey = key;

    return realKey
}

module.exports = {
    getFromCache: function(key, getFromDB = async x => x, extractor = x => x) {
        return function(req, res, next) {
            let realKey = extractKey(key);

            redis.get(JSON.stringify(realKey), function(err, reply) {

                if(!reply) {
                    wrapper(realKey, getFromDB).then(data => {
                        let value = JSON.stringify(extractor(data));

                        redis.set(JSON.stringify(realKey), value, function(err, reply) {
                            req.cache = data;
                            next();
                        })
                    })
                }
                else {
                    req.cache = JSON.parse(reply);
                    next();
                }
            })
        }
    },
    uncacheItem: function(key, cb) {
        let realKey = extractKey(key);

        redis.del(JSON.stringify(realKey), function(err, reply) {
            cb(err, reply);
        });
    }
}
*/ 
