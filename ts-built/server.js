var express_1 = require("express");
var userContext_1 = require("./userContext");
var app = express_1.default();
app.get("/", userContext_1.userContext.useCache(), function (req, res) {
    res.json({ cache: req.cache });
});
app.put("/", function (req, res) {
    userContext_1.userContext.uncache(userContext_1.passInPUT, function (err, reply) {
        res.json({ msg: "This user is now uncached" });
    });
});
