var express_1 = require("express");
var app = express_1.default();
var CacheControl_1 = require("./CacheControl");
function passInGET(req) {
    return { user_id: req.query.user_id };
}
function passInPUT(req) {
    return { user_id: req.body.user_id };
}
function DBCall(passIns, resolve, reject) {
    setTimeout(function (_) { return resolve({ hello: Math.random() * 50000000 }); }, 1500);
}
var userContext = CacheControl_1.createContext("USER_INFO", passInGET, DBCall);
app.get("/", userContext.useCache(), function (req, res) {
    res.json({ cache: req.cache });
});
app.put("/", function (req, res) {
    userContext.uncache(passInPUT, function (err, reply) {
    });
});
