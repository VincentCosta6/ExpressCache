import express from "express";

import { userContext, passInPUT } from "./userContext"

let app = express();

app.get("/", userContext.useCache(), function(req, res) {
    res.json({ cache: req.cache });
})

app.put("/", function(req, res) {
    userContext.uncache(passInPUT, function(err, reply) {
        res.json({ msg: "This user is now uncached" })
    })
})
