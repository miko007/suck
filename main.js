"use strict";

const Express = require("express");
const app     = Express();

const SUCK    = require("./src/SUCK");
const { response } = require("express");
const suck    = new SUCK();

app.use(function (request, response, next) {
    response.setHeader("Content-Type", "application/json");
    next();
});

app.get("/interfaces", async (request, response) => {
    const interfaces = await suck.interfaces();
    response.send(JSON.stringify(interfaces, null, 4));
});
app.post("/interfaces", (request, response) => {
    
});

app.get("/valve/:id", async (request, response) => {
});

app.listen(5000);