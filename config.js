import {
	game, debugMode
} from "./engine.js";

let directions = ["down", "right", "up", "left"];
export let worldMap = [];

class Camera {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.offsetX = 0;
		this.offsetY = 0;
		this.transition = {
			active: false,
			direction: null,
		};
	}
}

export class AnimationLoader {
	constructor() {
		this.animData = {};
		this.animList = [];
	}
	
	async load(jsonPath, sprName) {
		console.log(`jsonPath: ${jsonPath} / sprName: ${sprName}`);
		if (sprName===undefined) throw new Error(`Undefined sprName`);
		if (jsonPath===undefined) throw new Error(`Undefined jsonPath`);
		
		if (this.animData[sprName] || this.animList[sprName]) return;
		
		let filePath = jsonPath[0]+jsonPath[1]=="./" ? jsonPath : "./" + jsonPath;
		const r = await fetch(filePath);
		this.animData[sprName] = await r.json();
		this.animList.push(sprName);
		return this.animData;
	}
	
	//gets the table of one specific animation with direction
	getAnimation(sprName, anim, dir=0) {
		return this.animData[sprName]?.animations?.[anim]?.[directions[dir]];
	}
	
	//gets a property of the "prop" object of the animation
	getPropertyOfAnimations(sprName, anim) {
		return this.animData[sprName]?.animations?.[anim]?.prop;
	}
	
	//gets a property of the specific animation (spriteX, sclx, etc...)
	getAnimationProperty(sprName, anim, dir=0, frame=0, prop) {
		return this.animData[sprName]?.animations?.[anim]?.[directions[dir]]?.[frame]?.[prop];
	}
	
	//gets all the animations
	getAllAnimations(sprName) {
		return this.animData[sprName]?.animations;
	}
	
	//gives the head property of the animations
	getProperty(sprName, prop) {
		return this.animData[sprName]?.[prop]
	}
	
	checkAnimationExist(sprName, anim) {
		return this.animData[sprName]?.animations?.[anim];
	}
}

class Entity {
	constructor({
		game, 
		sprName, 
		x=0, y=0, 
		sclx=null, scly=null, 
		jsonPath=null
	}) {
		//main and needed things
		this.x=x; this.y=y; //x and y position
		this.sprName=sprName; //new sprName, name used to save things about the entity
		this.direction = 0; //direction 0-3
		this.speed = 1; //walk speed
		this.sclx=sclx!==null ? sclx : (game.prop.baseSize*game.prop.scaleMult)/2;
		this.sclx=sclx!==null ? sclx : (game.prop.baseSize*game.prop.scaleMult)/2+game.prop.baseSize;
		this.state = "normal_idle";
		
		//animation and image things
		this.sprite = new Image(); //entity sprite
		this.jsonPath = jsonPath!==null ? jsonPath : `./data/anim/${sprName}.json`; //the path for the json
		this.anim = {
			frame: 0, //current frame
			timer: 0, //timer
			delay: 0, //space of time between one animation and other
			maxFrame: 0, //the max number of frames of that animation (used for loop animation)
			currAnim: "none" //current animation
		};
	}
	
	async init(animLoad, jsonAnim, sprName) {
		console.log(this);
		let json = jsonAnim !== undefined ? jsonAnim : this.jsonAnim;
		let anim = sprName !== undefined ? sprName : this.sprName;

		if (json === undefined) { console.error("jsonAnim is undefined"); return; }
		if (anim === undefined) { console.error("sprName is undefined"); return; }
		
		await animLoad.load(json, anim);
		
		this.anim.currAnim = this.state;
		let initAnim = animLoad.getAnimation(
			anim,
			this.anim.currAnim,
			this.direction,
		);
		
		console.log(`initAnim: ${initAnim} anim: ${anim} currAnim: ${this.anim.currAnim} direction: ${directions[this.direction]}`);
		
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
	
	update() {} //made to be overitten
	
	changeAnimation(animLoad) {
		this.anim.currAnim = this.state;
		this.anim.frame = 0;
		this.anim.timer = 0;
		let animation = animLoad.getAnimation(this.sprName, this.anim.currAnim, this.direction)
		if (animation===undefined) throw new Error(`Undefined Animation`);
		this.anim.maxFrame = animation.length;
	}
	
	animationUpdate() {
		if (this.anim.currAnim === "none" || this.anim.maxFrame===1) return;
		this.anim.timer++;
		if (this.anim.timer >= this.anim.delay) {
			//console.log(`before: ${this.anim.frame}`);
			if (this.anim.maxFrame != 0) {
				let animation = animLoader.getAnimation(this.sprName, this.anim.currAnim, this.direction);
				let animProp = animLoader.getPropertyOfAnimations(this.sprName, this.anim.currAnim);
				if (this.anim.frame+1>this.anim.maxFrame || animation[this.anim.frame+1]===undefined) {
					if (animProp && !animProp.loop && animProp.nextAnim && checkAnimationExist(this.sprName, animProp.nextAnim)) {
						this.anim.currAnim = animProp.nextAnim;
						this.state = animProp.nextAnim;
					}
					this.anim.frame = 0;
				} else {
					this.anim.frame += 1;
				}
				let delayy = animLoader.getAnimationProperty(
					this.sprName,
					this.anim.currAnim,
					this.direction,
					this.anim.frame,
					"delay",
				);
				this.anim.delay = delayy!==undefined ? delayy : 0;
			}
			this.anim.timer = 0;
		}
	}
	
	draw(game, ctx) {
		let sliceSize = animLoader.getProperty(this.sprName, "baseSize");
		let entAnim = animLoader.getAnimation(this.sprName, this.state, this.direction);
		if (entAnim && entAnim[this.anim.frame]) {
			ctx.drawImage(
				this.sprite,
				entAnim[this.anim.frame].spriteX * sliceSize,
				entAnim[this.anim.frame].spriteY * sliceSize,
				sliceSize, sliceSize,
				this.x,
				this.y,
				game.prop.baseSize, game.prop.baseSize
			);
		} else {throw new Error(`undefined entAnim`);}
	}
}

class Player extends Entity {
	constructor({
		game, 
		sprName, 
		x=0, y=0, 
		jsonPath
	}) {
		super({
			game: game, 
			x: x, 
			y: y, 
			jsonPath: jsonPath,
			sprName: sprName
		}); //gimme your attribs daddy aaa
		this.status = {
			hp : 3.5,
			maxHp : 4,
			rupees : 415,
			exp : 0
		};
		this.inventory = [];
		this.handItem = {A: 1, B: 0}; //make it use a table based system like this: Item.Equip['iron_sword']
		//let this thing rotting until this system be functional to prevent headache
	}
	
	update(deltaTime, cam, controls, animLoad) {
		//implement the system of playUntilEnd animations and after that the tiles
		let deltaX = 0;
		let deltaY = 0;
		let oldState = this.state;
		let state1, state2; //st1-normal,water,defend / st2-walk,idle
		if (true) {
			
			state1 = "normal";
			
			let moveX = Number(controls.left) - Number(controls.right);
			let moveY = Number(controls.up) - Number(controls.down);
			
			deltaX -= moveX * this.speed;
			deltaY -= moveY * this.speed;
			
			if (moveX!==0 || moveY!==0) {
				state2 = "walk";
			} else {
				state2 = "idle";
			}
			
			if (controls.right) {
				if (!controls.down && !controls.up && !controls.left) {
					this.direction = 1;
				}
			}
			if (controls.left) {
				if (!controls.down && !controls.up && !controls.right) {
					this.direction = 3;
				}
			}
			if (controls.up) {
				if (!controls.down && !controls.left && !controls.right) {
					this.direction = 2;
				}
			}
			if (controls.down) {
				if (!controls.up && !controls.left && !controls.right) {
					this.direction = 0;
				}
			}
		}
		
		this.state = `${state1}_${state2}`;
		
		this.x+= deltaX;
		this.y+= deltaY;
		
		if (this.state!==oldState) { this.changeAnimation(animLoad); }
		this.animationUpdate();
	}
}

export let camera = new Camera(0, 0);
export const animLoader = new AnimationLoader();
export let playerProp = new Player({
	game: game,
	sprName: "player"
});