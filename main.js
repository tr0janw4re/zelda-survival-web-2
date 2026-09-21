import {
	game, debugMode
} from "./engine.js";
import {
	camera, playerProp, animLoader
} from "./config.js";
import {
	controls
} from "./input.js";

let counter = 0;

game._init("gameLmao");

game._update = function(deltaTime) {
	//To test the game loop
	controls.update();
	playerProp.update(deltaTime, camera, controls, animLoader);
}

game._draw = function(ctx) {
	game.draw.ctx.textBaseline = "top"; //delete this later goofy goober
	game.draw.clear(0, 0, game.prop.width, game.prop.height);
	game.draw.setColor("#ffffff");
	game.draw.rect("fill", 0, 0, game.prop.width, game.prop.height);
	playerProp.draw(game, game.draw.ctx);
	game.draw.setFont("4px monospace");
	game.draw.setColor("#000000");
	/* game.draw.line({
		list: [[0, 0],
		[50, 10],
		[120, 60]]
	}); */
}

game._debugUpdate = function(deltaTime){}

game._debugDraw = function(ctx) {
	game.draw.text(`${game.prop.gameTitle} - ${game.prop.version}`,0,0); 
	game.draw.text(`X: ${playerProp.x} Y: ${playerProp.y} sprName: ${playerProp.sprName}, state: ${playerProp.state} currAnim: ${playerProp.anim.currAnim}`,0,4); 
	game.draw.text(`frame: ${playerProp.anim.frame} delay: ${playerProp.anim.delay} timer: ${playerProp.anim.timer} maxFrame: ${playerProp.anim.maxFrame}`, 0,8);
}

game._loop(performance.now());