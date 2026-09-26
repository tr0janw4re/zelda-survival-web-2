class Bush extends Tile {
	constructor(jsonPath) {
		super(3, "Grass", "object");
		this.jsonPath = "data/tiles/ground/json/object.json";
	}
	
	carry() { };
	launch() { };
	cutGrass() { };
}