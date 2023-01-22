"use strict";

const path   = require("path");
const fs     = require("fs");
const crypto = require("crypto")

class Valve {
	constructor() {
		this.current = 0;
		this.min     = 0;
		this.max     = 0;
	}

	percentage() {
		const percent = (this.current / 100) * (this.max - this.min);

		return percent < 0 ? 0 : percent;
	}
}

class State {
	constructor() {
		this.busy          = false;
		this.valves        = new Array(16).fill(new Valve());
		this.currentWeight = 0;
		this.hasConnection = false;
		this.recipes       = null;
		this.ingredients   = null;
		this.valves        = null;

		this.load();
	}

	load() {
		const folderRecipes = path.join(__dirname, "..", "data", "recipes");
		const recipes = {};
		for (const dir of fs.readdirSync(folderRecipes)) {
			if (!dir.match(/\.json$/gi))
				continue;
			const id = crypto.randomUUID();
			recipes[id] = {...JSON.parse(fs.readFileSync(path.join(folderRecipes, dir))), id};
		}
		this.recipes = recipes;

		const fileIngredients  = path.join(__dirname, "..", "data", "ingredients.json");
		const ingredients      = JSON.parse(fs.readFileSync(fileIngredients, {encoding : "utf-8"}));

		this.ingredients = ingredients;

		const fileValves = path.join(__dirname, "..", "data", "valves.json");
		const valves     = JSON.parse(fs.readFileSync(fileValves, {encoding : "utf-8"}));

		this.valves = valves;
	}
}

module.exports = State;
