"use strict";

const Express = require("express");
const Path    = require("path");
const app     = Express();
const api     = Express.Router();

const SUCK    = require("./src/SUCK");
const Command = require("./src/Command");
const { Socket } = require("dgram");
const suck    = new SUCK();

app.use("/api", api);

api.use(function (request, response, next) {
	response.setHeader("Content-Type", "application/json");
	response.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

app.use("/", Express.static(Path.join(__dirname, "frontend", "build")));

api.get("/serial/connection", (request, response) => {
	response.send(JSON.stringify({
		status : "OK",
		connected : suck.state.hasConnection
	}, null, 4));
});

api.get("/serial/interfaces", async (request, response) => {
	const interfaces = await suck.interfaces();
	response.send(JSON.stringify(interfaces, null, 4));
});
api.get("/serial/connect/:iface([^/]+/[^/]+)", (request, response) => {
	suck.portID = `/${request.params.iface}`;
	suck.connect();
	response.send("OK");
});
api.get("/serial/disconnect", (request, response) => {
	suck.portID = "";
	suck.disconnect();
	response.send("OK");
});

api.get("/valve/:id", async (request, response) => {
	suck.sendCommand(Command.GET_VALVE, request.params.id);
	response.send("OK");
});

app.listen(5000);
