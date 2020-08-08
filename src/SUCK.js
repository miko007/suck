"use strict";

const SerialPort   = require("serialport");
const ReadLine     = require("@serialport/parser-readline");

const State        = require("./State");
const Command      = require("./Command");
const SerialParser = require("./SerialParser");

class SUCK {
    constructor() {
        this.state  = new State();
        this.parser = new SerialParser();
        this.port   = new SerialPort("/dev/tty.usbserial-1420", {
            baudRate : 115200,
            autoOpen : false
        });
        this.socket = this.port.pipe(new ReadLine({delimiter : '\n'}));

        this.socket.on("data", data => this.handleData(data));
        this.port.on("close", () => this.state.hasConnection = false);
    }

    connect() {
        this.port.open(async error => {
            if (error)
                return;
            this.state.hasConnection = true;
            await this.sendCommand(Command.SET_COMMENTS, 0);
        });  
    }

    disconnect() {
        this.port.close(error => {
        });
    }

    async interfaces() {
        return SerialPort.list();
    }

    handleData(line) {
        this.parser.parse(line);
    }

    async sendCommand(command, ...args) {
        return new Promise((resolve, reject) => {
            this.port.write(`${command} ${args.join(' ')}\n`, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
}

module.exports = SUCK;