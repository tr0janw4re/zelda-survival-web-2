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

const debugDrawingTile = "stone";
tileList[debugDrawingTile].state = "snowy"

game._update = function(deltaTime) {
	//To test the game loop
	controls.update();
	playerProp.update(deltaTime, camera, controls, animLoader);
}

game._draw = function(ctx) {
	game.draw.ctx.textBaseline = "top"; //delete this later goofy goober
	game.draw.clear(0, 0, game.prop.width, game.prop.height);
	game.draw.setColor("#ffffff");
	drawWorld(ctx);
	game.draw.rect("fill", 0, 0, game.prop.width, game.prop.height);
	playerProp.draw(game, game.draw.ctx);
	game.draw.setFont("4px monospace");
	game.draw.setColor("#000000");
	tileList[debugDrawingTile].draw(game, game.draw.ctx, tileAnim);
	/* game.draw.line({
		list: [[0, 0],
		[50, 10],
		[120, 60]]
	}); */
}

function drawWorld(ctx) {
	//ctx.drawImage()
}

game._debugUpdate = function(deltaTime){}

game._debugDraw = function(ctx) {
	game.draw.text(`${game.prop.gameTitle}: ${game.prop.returnFullVersion()}`,0,0); 
	game.draw.text(`X: ${playerProp.x} Y: ${playerProp.y} sprName: ${playerProp.sprName}, state: ${playerProp.state} currAnim: ${playerProp.anim.currAnim}`,0,4); 
	game.draw.text(`frame: ${playerProp.anim.frame} delay: ${playerProp.anim.delay} timer: ${playerProp.anim.timer} maxFrame: ${playerProp.anim.maxFrame}`, 0,8);
}

game._loop(performance.now());