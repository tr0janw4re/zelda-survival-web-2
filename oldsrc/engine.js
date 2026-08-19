//For handling collisions and state updates
import { camera, linkProp, animLoader } from "./config.js";
import { controls } from "./input.js";
import { perChunkWorld, tileAnim } from "./world.js";

export function _update(deltaTime) {
	
	camera.transitionCheck(linkProp, perChunkWorld);
	if (!camera.transition.active) {
		controls.update();

		linkProp.update(deltaTime);
		linkProp.inputHandler(camera, controls, animLoader);

		//tile animation guys
		if (tileAnim.fTimer >= tileAnim.fDelay) {
			tileAnim.frame = (tileAnim.frame + 1) % tileAnim.totalF;
			tileAnim.fTimer = 0;
		}
		tileAnim.fTimer++;
	}
}
