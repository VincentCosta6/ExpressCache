import express from "express";
// CREATE STORE AND CONTEXTS BEFORE THIS
import { userContext, passInPUT } from "./userContext"

let app = express();




app.get("/", userContext.useCache(), function(req, res) {
    res.json({ cache: req.redisContext });
})

app.put("/", function(req, res) {
    userContext.uncache(passInPUT, function(err, reply) {
        res.json({ msg: "This user is now uncached" })
    })
})
