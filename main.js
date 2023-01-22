"use strict";

const Express    = require("express");
const bodyParser = require("body-parser");
const Path       = require("path");
const app        = Express();
const fs         = require("fs");
const api        = Express.Router();

require("dotenv").config();

const SUCK    = require("./src/SUCK");
const Command = require("./src/Command");
const suck    = new SUCK();

let SerialBuffer = "";

suck.registerCallback(data => {
	SerialBuffer += "" + data;
});

const jsonParser = bodyParser.json();

app.use("/api", api);

api.use(function (request, response, next) {
	response.setHeader("Content-Type", "application/json");
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

app.use("/", Express.static(Path.join(__dirname, "frontend", "build")));

api.get("/serial/connection", (_, response) => {
	response.send(JSON.stringify({
		status : "OK",
		connected : suck.state.hasConnection
	}, null, 4));
});

api.post("/serial/command", jsonParser, async (request, response) => {
	const {command} = request.body;
	suck.port.write(`${command}\n`);
	response.send("OK");
});

api.get("/serial/buffer", async (_, response) => {
	response.send(JSON.stringify({ content : SerialBuffer.replace(/(\r\n|\r|\n)/g, "\n")}));
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

api.get("/valves/count", async (_, response) => {
	response.send(process.env.NUM_VALVES || 16);
});

api.get("/valve/:id", async (request, response) => {
	suck.sendCommand(Command.GET_VALVE, request.params.id);
	response.send("OK");
});

api.get("/recipes", async (_, response) => {
	response.send(JSON.stringify(Object.values(suck.state.recipes)));
});

api.get("/recipe/:id/pour", async(request, response) => {
	const {id}   = request.params;
	const recipe = suck.state.recipes[id];

	console.log("REC", recipe);
	// 1. Prüfen ob am Hahn
	// 2. absenden
	// 3. wenn nicht am hahn, fehler senden

	response.send("OK");
});

api.get("/ingredients", (_, response) => {
	response.send(JSON.stringify(suck.state.ingredients));
});

api.get("/valves", (_, response) => {
	response.send(JSON.stringify(suck.state.valves));
});

api.post("/valves", jsonParser, (request, response) => {
	const valves = request.body;
	const fileValves = Path.join(__dirname, "data", "valves.json");
	fs.writeFileSync(fileValves, JSON.stringify(valves, null, 4));

	response.send("OK");
});

api.get("/emergency-stop", (_, response) => {
	suck.sendCommand(Command.EMERGENCY_STOP);
});

app.listen(9000);
