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
	ctx.textBaseline = "top";
	ctx.clearRect(0, 0, game.prop.width, game.prop.height);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, game.prop.width, game.prop.height);
	playerProp.draw(game, ctx);
	ctx.font = "4px monospace";
	ctx.fillStyle = "#000000";
	ctx.fillText(`X: ${playerProp.x} Y: ${playerProp.y} sprName: ${playerProp.sprName}, state: ${playerProp.state} currAnim: ${playerProp.anim.currAnim}`,0,0); 
	ctx.fillText(`frame: ${playerProp.anim.frame} delay: ${playerProp.anim.delay} timer: ${playerProp.anim.timer} maxFrame: ${playerProp.anim.maxFrame}`, 0,4);
}

game._loop(performance.now());