class Sand extends Tile {
	constructor(jsonPath) {
		super(1, "Sand", "ground");
		this.jsonPath = "data/tiles/ground/json/sand.json";
		this.secretChance = Math.random(0, 200);
	}
	
	inspect() {
		//the player inspects to see if there is
		//a secret, smth like a golden nugget
	}
}