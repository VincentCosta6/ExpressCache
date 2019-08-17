import express from "express";
// CREATE STORE AND CONTEXTS ON MASTER THREAD
import { getContext } from "./store"

let app = express();


let { useCache, uncache, passIns } = getContext("USER_DATA");

app.get("/", useCache(), function(req, res) {
    res.json({ cache: req.redisContext });
})

app.put("/", function(req, res) {
    uncache(passIns, function(err, reply) {
        res.json({ msg: "This user is now uncached" })
    })
})
