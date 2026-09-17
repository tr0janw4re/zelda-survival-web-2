class Draw {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width; this.height = height;
	}

	clear(x=0, y=0, width=this.width, height=this.height) {
		this.ctx.clearRect(x, y, width, height);
	}
	
	setColor(value) {
		this.ctx.fillStyle = value;
		this.ctx.strokeStyle = value;
	}

	setAlpha(value) {
		this.ctx.globalAlpha = value/255;
	}

	setLineWidth(value) {
		this.ctx.lineWidth = value;
	}
	
	rect(type, x1, y1, x2, y2) {
		if (type==="fill") {
			this.ctx.fillRect(x1, y1, x2, y2);
		} else if (type==="stroke") {
			this.ctx.strokeRect(x1, y1, x2, y2);
		}
	}

	line({list=[]}) {
		//pls add the stroke type pretty pls
		if (list.length>0) {
			this.ctx.moveTo(list[0][0], list[0][1]);
			for (let i=0; i<list.length; i++) {
				this.ctx.lineTo(list[i][0], list[i][1]);
			}
			this.ctx.stroke();
		}
	}

	setFont(stringthing) {
		//wow so smart attempt to add it
		this.ctx.font = stringthing;
	}

	text(text, x=0, y=0) {
		this.ctx.fillText(text, x, y);
	}
}

class GameProp {
	constructor(width, height, scaleMult, baseSize, title) {
		this.width = width; this.height = height; //game window scale
		this.scaleMult = scaleMult; //sprSize sucessor
		this.baseSize = baseSize; //basesprSize sucessor
		this.gameTitle = "Zelda Survival"; //web tab name
		this.version = {
			major: 0, //x.0.0-a.0 - d
			minor: 1, //0.x.0-a.0 - d
			patch: 9, //0.0.x-a.0 - d
			stage: "prototype", //0.0.0-x.0 - d
			prNumb: "1", //0.0.0-a.x - d
			verName: "Losing my Marbles!" //0.0.0-a.0 - x
		}
	}
}

class DebugMode {
	constructor(on) {
		this.on=on;
		//add here debug things
	}
}

class Game {
	constructor({
		width, 
		height, 
		scaleMult=1,
		baseSize=16,
		title="Zelda Survival",
		pixelPerf=true
	}) {
		if (width<=0 || height<=0 || scaleMult<=0) {
			throw new Error(`The window scale properties need to be positive`);
		}
		//gameLoop things
		this.currTime; this.lastTime;
		this.fps; this.deltaTime;
		this.prop = new GameProp(width, height, scaleMult, baseSize);
		this.gWindow; this.ctx; this.pixelPerf = pixelPerf;
		this.stop = false;
	}
	
	_init(idName) {
		if (!idName) { console.error("No ID name for canvas"); return}
		this.gWindow = document.createElement('canvas');
		this.gWindow.setAttribute("id", idName);
		this.gWindow.width = this.prop.width*this.prop.scaleMult;
		this.gWindow.height = this.prop.height*this.prop.scaleMult;
		
		document.body.appendChild(this.gWindow);
		
		this.draw = new Draw(this.gWindow.getContext("2d"), this.prop.width, this.prop.height);
		this.draw.ctx.setTransform(this.prop.scaleMult, 0, 0, this.prop.scaleMult, 0, 0);
		if (this.pixelPerf) this.draw.ctx.imageSmoothingEnabled=false;
		console.log(this);
	}
	
	_loop(timestamp) {
		if (this.stop) return;
		
		if (!(this.gWindow instanceof HTMLCanvasElement)) {
			console.error("Game window wasn't created, use '_init()' to create");
			return;
		}
		
		if (this.lastTime===undefined) {
			this.lastTime = timestamp;
		}
		
		this.deltaTime = timestamp - this.lastTime;
		this.lastTime = timestamp;
		this.fps = 1000 / this.deltaTime;
		
		this._update(this.deltaTime);
		this._draw(this.ctx);
		
		requestAnimationFrame(() => this._loop());
	}
	
	_update(deltaTime) {} //fill after creation
	_draw(ctx) {} //fill after creation
	_stop() {this.stop = true;} //uhhhhhhhhhh
	_resume() {
		if (this.stop) {
			this.stop = false;
			this.lastTime = undefined;
		}
	}
	
	//some debug stuff
	printCurrStatus() {
		console.log(this);
	}
}

export let debugMode = new DebugMode(true);
export const game = new Game({
	width: 160, 
	height: 144, 
	scaleMult: 4
}); 
