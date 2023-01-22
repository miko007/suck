"use strict";

const SerialPort   = require("serialport");
const ReadLine     = require("@serialport/parser-readline");

const State        = require("./State");
const Command      = require("./Command");
const SerialParser = require("./SerialParser");

class SUCK {
	constructor() {
		this.state     = new State();
		this.parser    = new SerialParser();
		this.callbacks = [];
		this.port      = null;
		this.portID    = null;
		this.socket    = null;
		//this.connect();
	}

	connect() {
		if (this.portID === null)
			return;

		console.log(this.portID);
		this.port   = new SerialPort(this.portID, {
			baudRate: 115200,
			autoOpen: false,
		});
		this.socket = this.port.pipe(new ReadLine({ delimiter: "\n" }));
		this.socket.on("data", (data) => {
			for (const callback of this.callbacks) {
				callback(data);
			}
			this.handleData(data);
		});
		this.port.on("close", () => (this.state.hasConnection = false));

		this.port.open(async (error) => {
			if (error) {
				console.log(error);
				return;
			}
			this.state.hasConnection = true;
			await this.sendCommand(Command.SET_COMMENTS, 0);
		});
	}

	disconnect() {
		this.port.close((error) => {});
	}

	async interfaces() {
		return SerialPort.list();
	}

	handleData(line) {
		this.parser.parse(line);
	}

	registerCallback(callback) {
		this.callbacks.push(callback);
	}

	async sendCommand(command, ...args) {
		return new Promise((resolve, reject) => {
			this.port.write(`${command} ${args.join(" ")}\n`, (error) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
}

module.exports = SUCK;
