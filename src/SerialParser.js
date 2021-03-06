"use strict";

class SerialParser {
    constructor() {
        this.inBlock        = false;
        this.currentCommand = null;
    }

    async parse(line) {
        if (line.trim().match(/^\/\//))
            return;

        if (line.trim().match(/^BEGIN ([A-Za-z]+)/)) {
            if (!this.inBlock) {
                this.inBlock = true;
                this.currentCommand = "";
            }
        } else {
            if (!this.inBlock)
                return;
            if (line.match(/END/)) {
                this.inBlock = false;
                return;
            }
            switch(this.currentCommand) {
                case "STAT":
                    if (active) 
                    break;
                case "gv":
                    break;
            }
            command = line.split(" ");
            cmd = command[0];
            params = command.shift();

        }
        
    }
}


module.exports = SerialParser;