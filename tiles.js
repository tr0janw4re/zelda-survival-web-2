import {
	worldMap, AnimationLoader
} from "./config.js";

class TileAnimationLoader extends AnimationLoader {	
	//gets the table of one specific animation with direction
	
	//load is the same
	
	getAnimation(sprName, state, pos) {
		return this.animData[sprName]?.sprites?.[state]?.[pos];
	}
	
	//gets a property of the "prop" object of the animation
	getPropertyOfAnimations(sprName, state) {
		return this.animData[sprName]?.sprites?.[state]?.prop;
	}
	
	//gets a property of the specific animation (spriteX, sclx, etc...)
	getAnimationProperty(sprName, state, pos, frame=0, prop) {
		return this.animData[sprName]?.sprites?.[state]?.[pos]?.[frame]?.[prop];
	}
	
	//gets all the animations
	getAllAnimations(sprName) {
		return this.animData[sprName]?.sprites;
	}
	
	//getProperty is the same
	
	checkAnimationExist(sprName, state) {
		return this.animData[sprName]?.sprites?.[state];
	}
}

export const tileAnim = new TileAnimationLoader();

class TileList {	
	async init(animLoad) {
		const keys = Object.keys(this);
		for (let i=0; i<keys.length; i++) {
			console.log(`loading ${keys[i]}`);
			await this[keys[i]].load(animLoad);
		}
	}
}

class Tile {
	constructor({
		name, json, state="normal", prop={}
	}) {
		this.name = name;
		this.json = json;
		this.state = state;
		this.prop = prop;
		this.sprite = new Image();
		this.anim = {
			frame: 0,
			timer: 0,
			delay: 0,
			maxFrame: 0,
			currAnim: `${this.name}_${this.state}`
		}
	}
	
	updateAnimation() {
		
	}
	
	async load(animLoad) {
		console.log(this);
		let json = this.json;
		let anim = this.name;

		if (json === undefined) { console.error("json is undefined"); return; }
		if (anim === undefined) { console.error("name is undefined"); return; }
		
		await animLoad.load(json, anim);
		
		this.anim.currAnim = this.state;
		
		let initAnim = animLoad.getAnimation(
			anim,
			`${this.name}_${this.state}`,
			"middle",
		);
		this.anim.frame = 0;
		this.anim.timer = 0;
		this.anim.delay = initAnim[this.anim.frame].delay!==undefined ? initAnim[this.anim.frame].delay : 0;
		this.anim.maxFrame = initAnim.length;
		
		const spritesheet = animLoad.getProperty(anim, "spritesheet");
		return new Promise((resolve) => {
			this.sprite.src = spritesheet;
			this.sprite.onload = () => resolve();
		});
	}
	
	draw(game, ctx, animLoader) {
		let sliceSize = animLoader.getProperty(this.name, "baseSize");
		let entAnim = animLoader.getAnimation(this.name, `${this.name}_${this.state}`, "cornerA");
		if (entAnim && entAnim[this.anim.frame]) {
			ctx.drawImage(
				this.sprite,
				entAnim[this.anim.frame].spriteX * sliceSize,
				entAnim[this.anim.frame].spriteY * sliceSize,
				sliceSize, sliceSize,
				0,
				0,
				game.prop.baseSize, game.prop.baseSize
			);
		} else {
			ctx.drawImage(
				missigno,
				0,
				0,
				16, 16,
				0,
				0,
				game.prop.baseSize, game.prop.baseSize
			);
		}
	}
}

export let tileList = new TileList();
tileList["missigno"] = new Tile({name: "missigno", json:"data/tiles/json/missigno.json", prop:{}});
tileList["grass"] = new Tile({name: "grass", json:"data/tiles/json/grass.json", prop:{}});
tileList["rock"] = new Tile({name: "rock", json:"data/tiles/json/rock.json", prop:{}});
tileList["stonebrick"] = new Tile({name: "stonebrick", json:"data/tiles/json/stonebrick.json", prop:{}});
tileList["boulder"] = new Tile({name: "stonebrick", json:"data/tiles/json/boulder.json", prop:{}});