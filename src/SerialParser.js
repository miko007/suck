"use strict";

class SerialParser {
	constructor() {
		this.inBlock        = false;
		this.currentCommand = null;
	}

	async parse(line) {
		line = line.trim();

		console.log(line);
		/**
		 * ignore comments
		 */
		if (line.match(/^\/\//))
			return;

		if (line.match(/^\+([A-Za-z]+)/)) {
			if (!this.inBlock) {
				this.inBlock = true;
				this.currentCommand = "";
			}
		} else {
			if (!this.inBlock)
				return;
			if (line.match(/^-/)) {
				this.inBlock = false;
				return;
			}
			switch (this.currentCommand) {
				case "STAT":
					if (active) break;
				case "gv":
					break;
			}
			command = line.split(" ");
			cmd     = command[0];
			params  = command.shift();
		}
	}
}

module.exports = SerialParser;
