var express_1 = require("express");
// CREATE STORE AND CONTEXTS ON MASTER THREAD
var store_1 = require("./store");
var app = express_1.default();
var _a = store_1.getContext("USER_DATA"), useCache = _a.useCache, uncache = _a.uncache, passIns = _a.passIns;
app.get("/", useCache(), function (req, res) {
    res.json({ cache: req.redisContext });
});
app.put("/", function (req, res) {
    uncache(passIns, function (err, reply) {
        res.json({ msg: "This user is now uncached" });
    });
});
