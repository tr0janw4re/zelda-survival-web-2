import {
	worldMap, AnimationLoader
} from "./config.js";

let missignoSprite = new Image();
missignoSprite.src = "./assets/missigno.png";

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
	
	errorDraw(game, ctx) {
		ctx.drawImage(
			missignoSprite,
			0,
			0,
			16, 16,
			0,
			0,
			game.prop.baseSize, game.prop.baseSize
		);
	} 
}

class Tile {
	constructor({
		name, json, state="normal", createProp={}, side="middle"
	}) {
		this.name = name;
		this.json = json;
		this.state = state;
		this.createProp = createProp;
		this.sprite = new Image();
		this.side = side;
		this.anim = {
			frame: 0,
			timer: 0,
			delay: 0,
			maxFrame: 0,
			currAnim: `${this.name}_${this.state}`
		}
		console.log(`created tile ${this.name}`);
	}
	
	createTile(createChanges={}) {
		return {
			name: createChanges.name || this.name,
			state: createChanges.state || this.state,
			prop: createChanges.prop || this.createProp,
			side: createChanges.side || this.side,
			anim: createChanges.anim || this.anim
		}
	}
	
	animationUpdate(animLoader) {
		if (this.anim.currAnim === "none" || this.anim.maxFrame===1) return;
		this.anim.timer++;
		if (this.anim.timer >= this.anim.delay) {
			//console.log(`before: ${this.anim.frame}`);
			if (this.anim.maxFrame != 0) {
				let animation = animLoader.getAnimation(this.name, `${this.name}_${this.state}`, this.side);
				//console.log(animation);
				let animProp = animLoader.getPropertyOfAnimations(this.name, this.anim.currAnim);
				if (this.anim.frame+1>this.anim.maxFrame || animation[this.anim.frame+1]===undefined) {
					if (animProp && !animProp.loop && animProp.nextAnim && checkAnimationExist(this.name, animProp.nextAnim)) {
						this.anim.currAnim = animProp.nextAnim;
						this.state = animProps.nextAnim;
					}
					this.anim.frame = 0;
				} else {
					this.anim.frame += 1;
				}
				let delayy = animLoader.getAnimationProperty(
					this.name,
					`${this.name}_${this.state}`,
					this.side,
					this.anim.frame,
					"delay",
				);
				this.anim.delay = delayy!==undefined ? delayy : 0;
			}
			this.anim.timer = 0;
		}
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
			this.side
		);
		console.log(`${this.name}_${this.state}`);
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
	
	draw(game, ctx, animLoader, x, y, tile) {
		let sliceSize = animLoader.getProperty(tile.name, "baseSize");
		let entAnim = animLoader.getAnimation(tile.name, `${tile.name}_${tile.state}`, tile.side);
		if (entAnim && entAnim[tile.anim.frame]) {
			ctx.drawImage(
				this.sprite,
				entAnim[tile.anim.frame].spriteX * sliceSize,
				entAnim[tile.anim.frame].spriteY * sliceSize,
				sliceSize, sliceSize,
				x,
				y,
				game.prop.baseSize, game.prop.baseSize
			);
		} else {
			ctx.drawImage(
				missignoSprite,
				0,
				0,
				16, 16,
				x,
				y,
				game.prop.baseSize, game.prop.baseSize
			);
		}
	}
	
	/* blockDraw(game, ctx, animLoader) {
		for (let i=0; i<)
	} */
}

export let tileList = new TileList();
tileList["missigno"] = new Tile({name: "missigno", json:"data/tiles/json/missigno.json", state: "missigno", createProp:{}});
tileList["grass"] = new Tile({name: "grass", json:"data/tiles/json/grass.json", createProp:{}, side: "cornerA"});
tileList["rock"] = new Tile({name: "rock", json:"data/tiles/json/rock.json", createProp:{}, side: "cornerA"});
tileList["stonebrick"] = new Tile({name: "stonebrick", json:"data/tiles/json/stonebrick.json", createProp:{}, side: "cornerA"});
tileList["boulder"] = new Tile({name: "boulder", json:"data/tiles/json/boulder.json", createProp:{}, side: "cornerA"});
tileList["flower"] = new Tile({name: "flower", json:"data/tiles/json/flower.json", createProp:{}});