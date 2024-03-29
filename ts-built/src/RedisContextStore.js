function wrapper(passIns, cb) {
    return new Promise(function (resolve, reject) {
        cb(passIns, resolve, reject);
    });
}
var defaultConverter = function (x) { return JSON.stringify(x); };
var defaultExtractor = function (x) { return JSON.parse(x); };
var RedisContextStore = (function () {
    function RedisContextStore(redisConnection, options) {
        this.redisConnection = redisConnection;
        this.contexts = new Map();
        this.safeMode = options.safeMode || true;
    }
    RedisContextStore.prototype.createContext = function (key, passIns, DBCall, converter, extractor) {
        if (converter === void 0) { converter = defaultConverter; }
        if (extractor === void 0) { extractor = defaultExtractor; }
        var contextExists = this.contexts.get(key);
        if (contextExists && this.safeMode) {
            console.error("KEY " + key + " already exists in contextList");
            process.exit(1);
            return;
        }
        var newContext = new Context(this, key, passIns, DBCall, converter, extractor);
        this.contexts.set(key, newContext);
        return newContext;
    };
    RedisContextStore.prototype.getContext = function (ContextKey) {
        return this.contexts.get(ContextKey);
    };
    return RedisContextStore;
})();
exports.RedisContextStore = RedisContextStore;
exports.createStore = function (redisConnection, options) {
    return new RedisContextStore(redisConnection, options);
};
var Context = (function () {
    function Context(ContextStore, key, passIns, DBCall, converter, extractor) {
        var _this = this;
        this.redisKey = function (passInContent) {
            return _this.key + ":" + _this.converter(passInContent);
        };
        this.useCache = function () {
            return function (req, res, next) {
                var getPassIns = this.passIns(req);
                var redisKey = this.redisKey(getPassIns);
                if (!req.redisContext)
                    req.cache = {};
                this.RedisClient.get(redisKey, function (err, reply) {
                    var _this = this;
                    if (!reply) {
                        wrapper(getPassIns, this.DBCall).then(function (data) {
                            var value = _this.converter(data);
                            _this.RedisClient.set(redisKey, value, function (err, reply) {
                                req.redisContext[this.key] = data;
                                next();
                            });
                        });
                    }
                    else {
                        req.redisContext[this.key] = this.extractor(reply);
                        next();
                    }
                });
            };
        };
        this.uncache = function (passInFunc, cb) {
            return function (req, res, next) {
                var redisKey = this.key + ":" + this.converter(passInFunc(req));
                this.RedisClient.del(redisKey, function (err, reply) {
                    cb(err, reply);
                });
            };
        };
        this.RedisClient = ContextStore.redisConnection;
        this.key = key;
        this.passIns = passIns;
        this.DBCall = DBCall;
        this.converter = converter;
    }
    return Context;
})();
exports.Context = Context;
