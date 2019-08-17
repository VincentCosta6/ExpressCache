import express from "express";

let app = express();

import { createContext } from "./CacheControl";

function passInGET(req) {
    return { user_id: req.query.user_id };
}
function passInPUT(req) {
    return { user_id: req.body.user_id };
}

function DBCall(passIns, resolve, reject) {
    setTimeout(_ => resolve({ hello: Math.random() * 50000000 }), 1500);
}

let userContext = createContext("USER_INFO", passInGET, DBCall);

app.get("/", userContext.useCache(), function(req, res) {
    res.json({ cache: req.cache });
})

app.put("/", function(req, res) {
    userContext.uncache(passInPUT, function(err, reply) {

    })
})
