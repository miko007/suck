"use strict";

class Valve {
    constructor() {
        this.current = 0;
        this.min     = 0;
        this.max     = 0;
    }

    percentage() {
        const percent = this.current / 100 * (this.max - this.min);

        return percent < 0 ? 0 : percent;
    }
}

class State {
    constructor() {
        this.busy          = false;
        this.valves        = new Array(16).fill(new Valve());
        this.currentWeight = 0;
        this.hasConnection = false;
    }
}

module.exports = State;