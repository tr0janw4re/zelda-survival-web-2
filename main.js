import {
	game, debugMode
} from "./engine.js";
import {
	camera, playerProp, animLoader, worldMap
} from "./config.js";
import {
	controls
} from "./input.js";
import {
	generateWorld
} from "./world.js";
import {
	tileAnim, tileList
} from "./tiles.js";

let counter = 0;

game._init("gameLmao");
await playerProp.init(animLoader, playerProp.jsonPath, playerProp.sprName);
await tileList.init(tileAnim);

export const debugDrawingTile = "rock";
//if (tileList[debugDrawingTile]) tileList[debugDrawingTile].state = "snowy";

generateWorld();

//let thing = tileList[debugDrawingTile].createTile({state: "normal"});
//console.log(thing);

game._update = function(deltaTime) {
	//To test the game loop
	controls.update();
	playerProp.update(deltaTime, camera, controls, animLoader);
	if (tileList[debugDrawingTile]) tileList[debugDrawingTile].animationUpdate(tileAnim);
}

game._draw = function(ctx) {
	game.draw.ctx.textBaseline = "top"; //delete this later goofy goober
	game.draw.clear(0, 0, game.prop.width, game.prop.height);
	game.draw.setColor("#ffffff");
	game.draw.rect("fill", 0, 0, game.prop.width, game.prop.height);
	drawWorld();
	playerProp.draw(game, game.draw.ctx);
	game.draw.setFont("4px monospace");
	game.draw.setColor("#000000");
	/* game.draw.line({
		list: [[0, 0],
		[50, 10],
		[120, 60]]
	}); */
}

function drawDebugTile() {
	if (tileList[debugDrawingTile]) {
		tileList[debugDrawingTile].draw(game, game.draw.ctx, tileAnim, 0, 0);
	} else {
		tileList["missigno"].draw(game, game.draw.ctx, tileAnim, 0, 0);
	}
}

function drawWorld() {
	for (let y=0; y<10; y++) {
		for (let x=0; x<10; x++) {
			if (tileList[worldMap[y][x].name]) {
				tileList[worldMap[y][x].name].draw(game, game.draw.ctx, tileAnim, x*16, y*16, worldMap[y][x]);
			} else {
				tileList["missigno"].draw(game, game.draw.ctx, tileAnim, 0, 0);
			}
		}
	}
}

game._debugUpdate = function(deltaTime){}

game._debugDraw = function(ctx) {
	game.draw.text(`${game.prop.gameTitle}: ${game.prop.returnFullVersion()}`,0,0); 
	game.draw.text(`X: ${playerProp.x} Y: ${playerProp.y} sprName: ${playerProp.sprName}, state: ${playerProp.state} currAnim: ${playerProp.anim.currAnim}`,0,4); 
	game.draw.text(`frame: ${playerProp.anim.frame} delay: ${playerProp.anim.delay} timer: ${playerProp.anim.timer} maxFrame: ${playerProp.anim.maxFrame}`, 0,8);
	game.draw.text(`debugDrawingTile: ${debugDrawingTile} exists: ${tileList[debugDrawingTile]===undefined ? false : true}`, 0, 12);
}

game._loop(performance.now());