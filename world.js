import {
	tileList
} from "./tiles.js";
import {
	game, debugMode
} from "./engine.js";
import {
	debugDrawingTile
} from "./main.js";
import {
	worldMap
} from "./config.js";

export function generateWorld() {
	if (game.debug.on && game.debug.debugWorld){
		for (let y=0; y<10; y++) {
			worldMap[y] = [];
			for (let x=0; x<10; x++) {
				worldMap[y][x] = tileList[debugDrawingTile].createTile();
			}
		}
	}
}