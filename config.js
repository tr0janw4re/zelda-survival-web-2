//For constants, initial configs and asset loading

import { worldSize } from "./world.js";

//the project version
export const projectProp = {
  verMajor: 0,
  verMinor: 1,
  verPatch: "9d",
  verDescrp: "Pratically Remade!",
};

console.log("Kill me");

//the webpage title
document.title = `Zelda Survival - ${projectProp.verMajor}.${projectProp.verMinor}.${projectProp.verPatch}`;

export const basesprSize = 16; //the base sprite size that the sprites use in the image
export const sprSize = 64; //the size that the sprites are rescaloned to be good on the big screen

//types of tileset
export let tileset = {
  dungeons: new Image(), //I think that I should make one imagefile for all the tileset
  overworld: new Image(),
  overworld_obj: new Image(),
};

tileset["dungeons"].src = "assets/tileset/dungeons/dungeons_t.png";
tileset["overworld"].src = "assets/tileset/overworld/overworld_t_g.png";
tileset["overworld_obj"].src = "assets/tileset/overworld/overworld_t_obj.png";

export let tilesetImgW = tileset["overworld"].naturalWidth / 16; //it is used for world drawing

export let hudImg = new Image();
let itemSpr = new Image();

hudImg.src = "assets/hud/weaponHud.png"; //loads the hud sprites
itemSpr.src = "assets/itemSprites.png"; //loads the item being used by links sprites

//I need to make new soundtracks
let musicList = {};
musicList["titleScreen"] = new Audio("assets/songs/ballad_of_a_new_start.mp3");

let directions = ["down", "right", "up", "left"];

if (sprSize != 64 && devMode.on) {
  devMode.linkColl = false;
}

let tileList = []; //make it contain every tile of the game

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

  //improve the transition, its broken

  makeTransition(direction, player) {
    if (!directions.includes(direction)) {
      return;
    }
    this.transition.active = true;
    let check = false;
    switch (direction) {
      case "down":
        if (this.y > -512) {
          this.y -= (sprSize / basesprSize) * 4; //needs to be revised later later
          player.y -= (sprSize / basesprSize) * 4;
        } else {
          this.offsetY += 1;
          this.y = 0;
          player.y = 0;
          check = true;
        }
        break;
      case "right":
        if (this.x > -640) {
          this.x -= (sprSize / basesprSize) * 4;
          player.x -= (sprSize / basesprSize) * 4;
        } else {
          this.offsetX += 1;
          this.x = 0;
          player.x = 0;
          check = true;
        }
        break;
      case "up":
        if (this.y < 512) {
          this.y += (sprSize / basesprSize) * 4;
          player.y += (sprSize / basesprSize) * 4;
        } else {
          this.offsetY -= 1;
          this.y = 0;
          player.y = 576 - sprSize * 2;
          check = true;
          console.log(player.y);
        }
        break;
      case "left":
        if (this.x < 640) {
          this.x += (sprSize / basesprSize) * 4;
          player.x += (sprSize / basesprSize) * 4;
        } else {
          this.offsetX -= 1;
          this.x = 0;
          player.x = 640 - sprSize;
          check = true;
        }
        break;
    }
    if (check) {
      this.transition.active = false;
      this.transition.direction = null;
      //console.log("end of the transition");
    } else {
      //console.log("making transition");
    }
  }

  transitionCheck(player, perChunkWorld) {
    //transition for a below screen
    if (
      player.y + player.scly + (sprSize / basesprSize) * 4 > 512 &&
      !this.transition.active &&
      this.offsetY < perChunkWorld.length - 1
    ) {
      this.transition.active = true;
      this.transition.direction = "down";
    }

    //transition for a upper screen
    if (player.y + (sprSize / basesprSize) * 4 < 0 && !this.transition.active) {
      if (this.offsetY > 0) {
        this.transition.active = true;
        this.transition.direction = "up";
      }
    }

    //transition for a screen on the right
    if (
      player.x + (sprSize / basesprSize) * 4 + player.sclx > 640 &&
      !this.transition.active &&
      this.offsetX < perChunkWorld[0].length - 1
    ) {
      this.transition.active = true;
      this.transition.direction = "right";
    }

    //transition for a screen on the left
    if (player.x + (sprSize / basesprSize) * 4 < 0 && !this.transition.active) {
      if (this.offsetX > 0) {
        this.transition.active = true;
        this.transition.direction = "left";
      }
    }
    if (this.transition.active && this.transition.direction !== null) {
      this.makeTransition(this.transition.direction, player);
    }
  }
}

class AnimationLoader {
  constructor() {
    this.animData = {};
    this.animList = [];
  }

  async load(jsonPath, intName) {
    console.log(`jsonPath: ${jsonPath} / intName: ${intName}`);
    if (intName === undefined) {
      console.log("AJAJKKJSAJKASD");
    }
    if (jsonPath === undefined) {
      console.error("The json path is undefined");
      return;
    }
    let filePath =
      jsonPath[0] + jsonPath[1] == "./" ? jsonPath : "./" + jsonPath;
    const response = await fetch(filePath);
    this.animData[intName] = await response.json();
    this.animList.push(intName);
    return this.animData;
  }

  //gets only a specific animation
  getAnimation(intName, anim, dir) {
    return this.animData[intName]?.animations?.[anim]?.[directions[dir]];
  }

  //gets a property of the animation (spriteX, sclx, etc...)
  getAnimationProperty(intName, anim, dir, frame, property) {
    return this.animData[intName]?.animations?.[anim]?.[directions[dir]]?.[frame]?.[property];
  }

  //gives all animations
  getAnimations(intName) {
    return this.animData[intName]?.animations;
  }

  //best invention that the humanity already made
  getProperty(intName, property) {
    return this.animData[intName]?.[property];
  }
}

class Entity {
	constructor(x, y, jsonAnim, animName) {
		//Main things
		this.x = x; //x position
		this.y = y; //y position
		this.animName = animName; //name used to save animations
		this.speed = sprSize / basesprSize; //walk speed
		this.direction = 0; //direction
		this.sclx = sprSize / 2; //scale X
		this.scly = sprSize / 2 + basesprSize; //scale Y
		this.sclxP = basesprSize; //wtf is this meant for???
		this.sclyP = basesprSize; //wtf is this meant for???
		this.state = "idle"; //implement this instead of use the anim.currAnim pretty please with a cherry on top

		//animation
		this.sprite = new Image();
		this.jsonAnim = jsonAnim;
		this.anim = {
			frame: 0,
			timer: 0,
			delay: 0,
			maxFrame: 0,
			currAnim: "none",
		};
	}

	async init(animLoad, jsonAnim, animName) {
		let json = jsonAnim !== undefined ? jsonAnim : this.jsonAnim;
		let anim = animName !== undefined ? animName : this.animName;

		if (json === undefined) { console.error("jsonAnim is undefined"); return; }
		if (anim === undefined) { console.error("animName is undefined"); return; }
		
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

	//self explanatory
	update() {}
	
	changeAnim(animLoad) {
		this.anim.currAnim = this.state;
		this.anim.frame = 0;
		let thing = animLoad.getAnimation(this.animName, this.anim.currAnim, this.direction);
		//console.log(thing);
		if (thing===undefined) {
			console.error(`Error - Undefined Animation, animLoad: ${animLoad} animName: ${this.animName} currAnim: ${this.currAnim}`);
			return;
		}
		this.anim.maxFrame = thing.length;
		//console.log("animation changed");
	}
	
	animationUpdate() {
		//this.anim.currAnim = this.state;
		if (this.anim.currAnim !== "none") {
			this.anim.timer++;
			if (this.anim.timer >= this.anim.delay) {
				//console.log(`before: ${this.anim.frame}`);
				if (this.anim.maxFrame != 0) {
					let animation = animLoader.getAnimation(this.animName, this.anim.currAnim, this.direction);
					if (this.anim.frame+1>this.anim.maxFrame || animation[this.anim.frame+1]===undefined) {
						this.anim.frame = 0;
					} else {
						this.anim.frame += 1;
					}
					let delayy = animLoader.getAnimationProperty(
						this.animName,
						this.anim.currAnim,
						this.direction,
						this.anim.frame,
						"delay",
					);
					this.anim.delay = delayy!==undefined ? delayy : 0;
				}
				this.anim.timer = 0;
			}
		} else {
			//console.error("none animation aaaa");
		}
	}

  //self explanatory
  draw(ctx) {
    //console.log(this);
    let sliceSize = animLoader.getProperty(this.animName, "baseSize");
    let entAnim = animLoader.getAnimation(
      this.animName,
      this.state,
      this.direction,
    );
    //console.log(this.anim.frame);
    if (entAnim && entAnim[this.anim.frame]) {
		ctx.drawImage(
			this.sprite,
			entAnim[this.anim.frame].spriteX * sliceSize,
			entAnim[this.anim.frame].spriteY * sliceSize,
			sliceSize,
			sliceSize,
			this.x,
			this.y,
			sprSize,
			sprSize,
		);
    } else {
      console.error("entAnim is null");
    }
  }

  //finish this you piece of shit
  //i finished it you bastard
  checkCollisionWithTile(tile) {
    let obj1prop = {
      left: this.x + this.sclxP,
      right: this.x + this.sclx,
      up: this.y - this.sclyP,
      down: this.y + this.scly,
    };
    let obj2prop = {
      left: tile.x,
      right: tile.x + tile.sclx,
      up: tile.y,
      down: tile.y + tile.scly,
    };
    return (
      obj1prop.right > obj2prop.left &&
      obj1prop.left < obj2prop.right &&
      obj1prop.down > obj2prop.up &&
      obj1prop.up < obj2prop.down
    );
  }
}

class Player extends Entity {
  constructor(x, y, spriteSheet, animName) {
    super(x, y, spriteSheet); //gimme your attribs daddy aaa
    //status things
    this.hp = 3.5;
    this.animName = animName;
    this.maxHp = 4;
    this.rupees = 415; //find a use for this
    this.inventory = [];
    this.useItem = 0; //?????
    this.handItem = {
      A: 1,
      B: 0,
    };
    this.moveX = 0;
    this.moveY = 0;
  }
  
  inputHandler(cam, controls, animLoad) {
    if (cam.transition.active) {
      return;
    }
    let deltaX = 0;
    let deltaY = 0;
	let oldState = this.state;

    if (this.state != "use_item") {
      this.moveX = Number(controls.left) - Number(controls.right);
      this.moveY = Number(controls.up) - Number(controls.down);

      //console.log(`Move X: ${this.moveX} Move Y: ${this.moveY}`);

      deltaX -= this.moveX * this.speed;
      deltaY -= this.moveY * this.speed;

      //direction changing (uhhh improve this someday)
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

      if (controls.b || controls.a) {
        if (controls.b && controls.a) {
          //idiot proof, find a better way later
        } else {
          if (this.state != "use_item") {
            this.useItem = controls.a ? 1 : 0;
            if (this.moveX != 0 || this.moveY != 0) {
              this.state =
                this.handItem[controls.a ? 1 : 0] == 1 ? "defend" : "walk_shield";
            } else {
              this.state =
                this.handItem[controls.a ? 1 : 0] == 1
                  ? "defend"
                  : "idle_shield";
            }
          }
        }
      } else {
        if (this.moveX != 0 || this.moveY != 0) {
		  this.state =
			this.handItem.B == 1 || this.handItem.A == 1 ? "walk_shield" : "walk";
		} else {
		  this.state =
			this.handItem.B == 1 || this.handItem.A == 1 ? "idle_shield" : "idle";
		}
		if (this.handItem.A == 1 || this.handItem.B == 1) {
		  if (this.state == "idle") {
			this.state = "idle_shield";
		  }
		} else {
		  if (this.state == "idle_shield") {
			this.state = "idle";
		  }
		}
      }
    }

    //update it to make the check usinf ternary pls
    this.x += this.state != "use_item" ? deltaX : 0;
    /*
    if (1 != 1) {
      //collision is temporaly disabled for improvements
      this.x -= deltaX;
    } else if (
      cam.offsetX == worldSize.width - 1 &&
      this.x + (sprSize / basesprSize) * 4 + this.sclx > 640
    ) {
      this.x -= deltaX;
    } else if (cam.offsetX == 0 && this.x + (sprSize / basesprSize) * 4 < 0) {
      this.x -= deltaX;
    }

    */

    this.y += !this.state != "use_item" ? deltaY : 0;

    /*
    if (1 != 1) {
      //collision is temporaly disabled for improvements
      this.y -= deltaY;
    } else if (
      cam.offsetY == worldSize.height - 1 &&
      this.y + this.scly + (sprSize / basesprSize) * 4 > 512
    ) {
      this.y -= deltaY;
    } else if (cam.offsetY == 0 && this.y + (sprSize / basesprSize) * 4 < 0) {
      this.y -= deltaY;
    }
    */

    if (
      this.state == "use_item" &&
      itemsSprProp[handItem[this.useItem]] &&
      itemsSprProp[handItem[this.useItem]].length !== 0
    ) {
      //checks to destroy a tile
    }
	
	if (this.state!=oldState) {
		this.changeAnim(animLoader);
	}
	
  }

  update() {
    if (this.rupees > 999) {
      this.rupees = 999;
    }

    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    this.animationUpdate();
  }
}

class Tile {
  constructor(id, name, type, jsonPath) {
    this.id = id;
    this.name = name;
    this.type = type; //ground, object
    this.solid = false;

    this.x = 0;
    this.y = 0;
    this.sclx = sprSize;
    this.scly = sprSize;

    //sprite and animation things
    this.jsonPath = jsonPath;
    this.spriteData = {};
  }

  async init(jsonPath) {
    let filePath = jsonPath[0] == "/" ? jsonPath : "/" + jsonPath;
    const response = await fetch(filePath);
    this.spriteData = await response.json();
    tileList[this.id] = this;
  }

  static hasSpecial(tileID) {
    return specialTiles.has(tileID);
  }

  deleteTile() {
    //thats...awful...
  }
}

class Item {
  constructor(id, name, jsonPath) {
    this.id = id;
    this.name = name;
    this.sprite = new Image();
    this.jsonPath = jsonPath;
  }
}

//anim - spritesheetX, Y, delay, x_offset, y_offset
//for fixes

export let camera = new Camera(0, 0);
export const animLoader = new AnimationLoader();

export let linkProp = new Player(0, 0, "data/anim/player.json", "player");
await linkProp.init(animLoader);

let itemsSprProp = [
  //a similar thing for the links animation, but it supports mirroring the sprites
  //item - sword
  [
    [
      //direction - down
      [-16, 8, 0, 0, false, false],
      [-13, 13, 1, 0, false, false],
      [0, 16, 2, 0, false, false],
      {
        offX: 2,
        offY: 12,
        sclx: 4,
        scly: 12,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //right
      [0, -16, 2, 0, false, true],
      [13, -13, 1, 0, true, true],
      [16, 9, 0, 0, true, false],
      {
        offX: 12,
        offY: 4,
        sclx: 12,
        scly: 4,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //up
      [16, 1, 0, 0, true, false],
      [13, -13, 1, 0, true, true],
      [-8, -16, 2, 0, false, true],
      {
        offX: 2,
        offY: -12,
        sclx: 4,
        scly: 12,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //left
      [-8, -16, 2, 0, false, true],
      [-13, -13, 1, 0, false, true],
      [-16, -1, 0, 0, false, true],
      {
        offX: -12,
        offY: 4,
        sclx: 12,
        scly: 4,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [
    [
      //direction - down
      [-16, 8, 3, 0, false, false],
      [-13, 13, 4, 0, false, false],
      [0, 16, 5, 0, false, false],
      {
        offX: 2,
        offY: 12,
        sclx: 4,
        scly: 12,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //right
      [0, -16, 5, 0, false, true],
      [13, -13, 4, 0, true, true],
      [16, 9, 3, 0, true, false],
      {
        offX: 12,
        offY: 4,
        sclx: 12,
        scly: 4,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //up
      [16, 1, 3, 0, true, false],
      [13, -13, 4, 0, true, true],
      [-8, -16, 5, 0, false, true],
      {
        offX: 2,
        offY: -12,
        sclx: 4,
        scly: 12,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    [
      //left
      [-8, -16, 5, 0, false, true],
      [-13, -13, 4, 0, false, true],
      [-16, -1, 3, 0, false, true],
      {
        offX: -12,
        offY: 4,
        sclx: 12,
        scly: 4,
        sclxP: basesprSize,
        sclyP: basesprSize,
      },
    ],
    //x offset, y offset, x sprite pos, y sprite pos, invert horizontal, invert vertical
  ],
];
