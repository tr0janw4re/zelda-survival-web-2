//For everything related to the map and tile data

import {
  projectProp,
  tileset,
  sprSize,
  basesprSize,
  tilesetImgW,
} from "./config.js";

export let worldSize = {
  //the size that the world is generated
  width: 16,
  height: 16,
};

let biomeTiles = [
  //specific tiles for each biome
  [0, 1, 2, 16, 17, 18, 32, 33, 34], //grass fields
  [3, 4, 5, 19, 20, 21, 35, 36, 37], //sepian mounts
  [6, 7, 8, 22, 23, 24, 38, 39, 40], //dark forest
  [9, 10, 11, 25, 26, 27, 41, 42, 43], //mytical forest
  [12], //desert of wastes
];

let specialTiles = [
  //special tiles that have different interactions with link
  [38, 39, 256], //this tiles the player won't collide
  [16, 17, 18, 19],
];

export let worldGenType = 0;
//0 - random, 1 - noise

let dungeonType = 0; //this definies what type of wall the dungeon needs to have

export let biomeTypes = [
  //the types of biomes
  "grass_field",
  "sepian_mounts",
  "dark_forest",
  "mytical_plains",
  "desert_of_wastes",
];

//Some things for object world generation:
let objTax = {
  //the var to create the objects in the world
  tree: 20,
  bush: 20,
  rock: 20,
};

export let tileAnim = {
  //used for make the flowers on the ground animated
  fTimer: 0, //tile frame timer
  frame: 0, //tile animation actual frame
  fDelay: 16, //time during a frame and another
  totalF: 4, //max frames for animation
};

export let perChunkWorld = []; //the world per chunk
export let mapGroundList = []; //the ground of the world
export let mapObjList = []; //the most inneficient way to add objects to the world

//here is where the world is generated
export function generateWorld() {
  //verifies if u aren't idiot and is erasing a entire world
  if (
    perChunkWorld.length !== 0 &&
    mapGroundList.length !== 0 &&
    mapObjList.length !== 0
  ) {
    let eraseWorld = confirm(
      "Your world will be lost if you create a new one! Do you really want to proceed?",
    );
    if (!eraseWorld) {
      return 0;
    }
  }

  //erase your world
  perChunkWorld = [];
  mapGroundList = [];
  mapObjList = [];

  //Generate World 8x10 Chunks

  if (worldGenType == 0) {
    for (let y = 0; y < worldSize.height; y++) {
      perChunkWorld[y] = [];
      for (let x = 0; x < worldSize.height; x++) {
        perChunkWorld[y][x] = Math.round(
          Math.random() * (biomeTypes.length - 1),
        );
        //perChunkWorld[y][x] = 0;
      }
    }
  } else if (worldGenType == 1) {
    const scale = 0.15;
    for (let y = 0; y < worldSize.height; y++) {
      perChunkWorld[y] = [];
      for (let x = 0; x < worldSize.width; x++) {
        let value = noise.perlin2(x * scale, y * scale);
        let norm = (value + 1) / 2;
        //console.log(`Value of the Noise: ${value} Norm: ${norm}`);
        let biomeIndex = Math.floor(norm * biomeTypes.length);
        perChunkWorld[y][x] = Math.min(biomeIndex, biomeTypes.length - 1);
      }
    }
  }
  //Turn the chunks in a real world
  for (let y = 0; y < worldSize.height; y++) {
    //first, it creates the y part
    for (let i = 0; i < 8; i++) {
      mapGroundList[y * 8 + i] = [];
      //it starts creating 8 spaces in Y part
    }
    for (let x = 0; x < worldSize.width; x++) {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
          mapGroundList[y * 8 + i][x * 10 + j] =
            biomeTiles[perChunkWorld[y][x]][0];
          //and after it will create 10 X spaces in each 8 Y spaces
        }
      }
    }
  }

  //Checks the world tile to make them look normal
  for (let y = 0; y < mapGroundList.length; y++) {
    for (let x = 0; x < mapGroundList[0].length; x++) {
      let currTile = mapGroundList[y][x];
      if (perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)] == 4) {
        continue;
      }
      if (1 == 1) {
        //ignore that check
        let validTiles = new Set(
          biomeTiles[perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]],
        );
        let tileright,
          tiledown,
          tileup,
          tileleft = "no";

        if (mapGroundList[y][x + 1] !== undefined) {
          tileright = mapGroundList[y][x + 1];
        }
        if (y + 1 != mapGroundList.length) {
          tiledown = mapGroundList[y + 1][x];
        }
        if (y != 0 && mapGroundList[y - 1][x] !== undefined) {
          tileup = mapGroundList[y - 1][x];
        }
        if (mapGroundList[y][x - 1] !== undefined) {
          tileleft = mapGroundList[y][x - 1];
        }

        if (validTiles.has(tileright)) {
          if (validTiles.has(tileleft)) {
            if (validTiles.has(tileup)) {
              if (validTiles.has(tiledown)) {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][4];
              } else {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][7];
              }
            } else {
              if (validTiles.has(tiledown)) {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][1];
              }
            }
          } else {
            if (validTiles.has(tileup)) {
              if (validTiles.has(tiledown)) {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][3];
              } else {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][6];
              }
            } else {
              mapGroundList[y][x] =
                biomeTiles[
                  perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                ][0];
            }
          }
        } else {
          if (validTiles.has(tileleft)) {
            if (validTiles.has(tileup)) {
              if (validTiles.has(tiledown)) {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][5];
              } else {
                mapGroundList[y][x] =
                  biomeTiles[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ][8];
              }
            } else {
              mapGroundList[y][x] =
                biomeTiles[
                  perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                ][2];
            }
          }
        }
      }
    }
  }

  //adds flowers into the ground
  for (let y = 0; y < mapGroundList.length; y++) {
    //the world is better and beautifull now
    for (let x = 0; x < mapGroundList[0].length; x++) {
      let detailsOnGround = Math.round(Math.random() * 4);
      if (detailsOnGround == 0) {
        //improve that sh*t
        switch (mapGroundList[y][x]) {
          case 17:
            mapGroundList[y][x] = 48;
            break;
          case 23:
            mapGroundList[y][x] = 54;
            break;
          case 20:
            mapGroundList[y][x] = 51;
            break;
          case 26:
            mapGroundList[y][x] = 57;
            break;
        }
      }
    }
  }

  //generates the objects on the world (just like trees, rocks, bushes, etc...)

  for (let y = 0; y < mapGroundList.length; y++) {
    //creating space on the object list
    mapObjList[y] = [];
    for (let x = 0; x < mapGroundList[0].length; x++) {
      mapObjList[y][x] = 256;
    }
  }

  for (let y = mapObjList.length - 1; y > 0; y--) {
    //object random generation
    for (let x = mapObjList[0].length - 1; x > 0; x--) {
      let tree = Math.round(Math.random() * objTax.tree);
      let bush = Math.round(Math.random() * objTax.bush);
      let rock = Math.round(Math.random() * objTax.rock);

      //console.log(tree);
      if (tree == 1) {
        if (x > 1 && y > 1) {
          if (y != 8 * Math.floor(y / 8)) {
            if (x != 10 * Math.floor(x / 10)) {
              if (perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)] == 2) {
                if (mapObjList[y][x] == 256 && mapObjList[y][x - 1] == 256) {
                  if (mapObjList[y][x] != 30 || mapObjList[y][x] != 31) {
                    if (mapObjList[y][x] == 15 || mapObjList[y][x] == 13) {
                      mapObjList[y][x] = 47;
                    } else if (
                      mapObjList[y][x] == 14 ||
                      mapObjList[y][x] == 12
                    ) {
                      mapObjList[y][x] = 12;
                    } else {
                      mapObjList[y][x] = 31;
                    }
                    if (mapObjList[y][x - 1] == 15) {
                      mapObjList[y][x - 1] = 13;
                    } else if (mapObjList[y][x - 1] == 14) {
                      mapObjList[y][x - 1] = 46;
                    } else {
                      mapObjList[y][x - 1] = 30;
                    }
                    mapObjList[y - 1][x] = 15;
                    mapObjList[y - 1][x - 1] = 14;
                    //break;
                  }
                }
              } else if (
                perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)] == 4
              ) {
                if (mapObjList[y][x] == 256 && mapObjList[y][x - 1] == 256) {
                  if (mapObjList[y][x] != 22 || mapObjList[y][x] != 23) {
                    if (mapObjList[y][x] == 7 || mapObjList[y][x] == 7) {
                      mapObjList[y][x] = 22;
                    } else if (mapObjList[y][x] == 6 || mapObjList[y][x] == 6) {
                      mapObjList[y][x] = 7;
                    } else {
                      mapObjList[y][x] = 23;
                    }
                    if (mapObjList[y][x - 1] == 7) {
                      mapObjList[y][x - 1] = 7;
                    } else if (mapObjList[y][x - 1] == 6) {
                      mapObjList[y][x - 1] = 23;
                    } else {
                      mapObjList[y][x - 1] = 22;
                    }
                    mapObjList[y - 1][x] = 7;
                    mapObjList[y - 1][x - 1] = 6;
                    //break;
                  }
                }
              } else {
                if (mapObjList[y][x] == 256 && mapObjList[y][x - 1] == 256) {
                  if (mapObjList[y][x] != 20 || mapObjList[y][x] != 21) {
                    if (mapObjList[y][x] == 5 || mapObjList[y][x] == 3) {
                      mapObjList[y][x] = 37;
                    } else if (mapObjList[y][x] == 4 || mapObjList[y][x] == 2) {
                      mapObjList[y][x] = 2;
                    } else {
                      mapObjList[y][x] = 21;
                    }
                    if (mapObjList[y][x - 1] == 5) {
                      mapObjList[y][x - 1] = 3;
                    } else if (mapObjList[y][x - 1] == 4) {
                      mapObjList[y][x - 1] = 36;
                    } else {
                      mapObjList[y][x - 1] = 20;
                    }
                    mapObjList[y - 1][x] = 5;
                    mapObjList[y - 1][x - 1] = 4;
                    //break;
                  }
                }
              }
            }
          } else {
            /* console.log("Trees shouldn't spawn here")
						console.log(x);
						console.log(y); */
          }
        }
      }
      if (bush == 1) {
        if (x > 1 && y > 1) {
          if (mapObjList[y][x] == 256) {
            for (let i = 0; i < biomeTiles.length; i++) {
              for (let biom = 0; biom < biomeTiles[i].length; biom++) {
                if (
                  biomeTypes[
                    perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                  ] != biomeTypes[4]
                ) {
                  if (mapGroundList[y][x] == biomeTiles[i][biom]) {
                    mapObjList[y][x] = 16 + i;
                  }
                }
              }
            }
            //alreadyBush=true;
          }
        }
      }
      if (rock == 1) {
        if (x > 1 && y > 1) {
          if (mapObjList[y][x] == 256) {
            for (let i = 0; i < biomeTiles.length; i++) {
              for (let biom = 0; biom < biomeTiles[i].length; biom++) {
                if (mapGroundList[y][x] == biomeTiles[i][biom]) {
                  if (
                    biomeTypes[
                      perChunkWorld[Math.floor(y / 8)][Math.floor(x / 10)]
                    ] != biomeTypes[4]
                  ) {
                    if (i == 1) {
                      mapObjList[y][x] = 32;
                    } else {
                      mapObjList[y][x] = 32 + i;
                    }
                  }
                }
              }
            }
            //alreadyRock=true;
          }
        }
      }
    }
    //break;
  }

  //prints some useless stuff
  console.log(`Map Y List ${mapGroundList.length} per block: 8`);
  console.log(`Map X List ${mapGroundList[0].length} per block: 10`);
  console.log(
    `${worldSize.width} Vertical Chunks and ${worldSize.height} Horizontal Chunks`,
  );
}

function exportMap() {
  const mapGroundData = mapGroundList
    .map((row, y) => row.map((value, x) => `${x},${y}=${value}`).join("\n"))
    .join("\n");

  const mapObjData = mapObjList
    .map((row, y) => row.map((value, x) => `${x},${y}=${value}`).join("\n"))
    .join("\n");

  const chunksData = perChunkWorld
    .map((row, y) => row.map((value, x) => `${x},${y}=${value}`).join("\n"))
    .join("\n");

  const mapList = `Map Ground:\n${mapGroundData}\n\nMap Objects:\n${mapObjData}\n\nChunk Data:\n${chunksData}\nGAMEVERSION: \n${projectProp.verMajor}.${projectProp.verMinor}.${projectProp.verPatch} - ${projectProp.verDescrp}`;

  const blob = new Blob([mapList], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const fileName = prompt("Insert your world name: ");

  a.href = url;
  a.download = `${fileName}.txt`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importMapList(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n");

    // Find section indexes properly
    const mapGroundStart = lines.indexOf("Map Ground:") + 1;
    const mapObjectsStart = lines.indexOf("Map Objects:") + 1;
    const chunkDataStart = lines.indexOf("Chunk Data:") + 1;

    const mapObjectsEnd = chunkDataStart - 2; // Stop parsing objects before Chunk Data
    const mapGroundEnd = mapObjectsStart - 2; // Stop parsing ground before Map Objects

    // Initialize empty 2D arrays
    mapGroundList = [];
    mapObjList = [];
    perChunkWorld = [];

    // Parse Map Ground section
    lines.slice(mapGroundStart, mapGroundEnd).forEach((line) => {
      if (!line.includes("=")) return;
      const [position, value] = line.split("=");
      const [x, y] = position.split(",").map(Number);
      if (!mapGroundList[y]) mapGroundList[y] = [];
      mapGroundList[y][x] = Number(value);
    });

    // Parse Map Objects section
    lines.slice(mapObjectsStart, mapObjectsEnd).forEach((line) => {
      if (!line.includes("=")) return;
      const [position, value] = line.split("=");
      const [x, y] = position.split(",").map(Number);
      if (!mapObjList[y]) mapObjList[y] = [];
      mapObjList[y][x] = Number(value);
    });

    // Parse Chunk Data section
    lines.slice(chunkDataStart).forEach((line) => {
      if (!line.includes("=")) return;
      const [position, value] = line.split("=");
      const [x, y] = position.split(",").map(Number);
      if (!perChunkWorld[y]) perChunkWorld[y] = [];
      perChunkWorld[y][x] = Number(value);
    });

    linkProp.x = 0;
    linkProp.y = 0;
    camera.offsetX = 0;
    camera.offsetY = 0;
    camera.x = 0;
    camera.y = 0;

    console.log("Imported Map Ground List:", mapGroundList);
    console.log("Imported Map Object List:", mapObjList);
    console.log("Imported Chunk Map:", perChunkWorld);
  };

  reader.readAsText(file);
}

export function generateMapImage() {
  if (!tileset["overworld"].complete) {
    alert("Tileset wasn't loaded yet");
    return;
  }

  const totalTilesX = mapGroundList[0].length;
  const totalTilesY = mapGroundList.length;

  const imageCanvas = document.createElement("canvas");
  const imageCtx = imageCanvas.getContext("2d");

  imageCtx.imageSmoothingEnabled = false;

  imageCanvas.width = totalTilesX * basesprSize;
  imageCanvas.height = totalTilesY * basesprSize;

  for (let y = 0; y < totalTilesY; y++) {
    for (let x = 0; x < totalTilesX; x++) {
      const tile = mapGroundList[y][x];
      if (tile == 256) continue;

      const imgX = tile % tilesetImgW;
      const imgY = Math.floor(tile / tilesetImgW);

      imageCtx.drawImage(
        tileset["overworld"],
        imgX * basesprSize,
        imgY * basesprSize,
        basesprSize,
        basesprSize,
        x * basesprSize,
        y * basesprSize,
        basesprSize,
        basesprSize,
      );
    }
  }

  for (let y = 0; y < totalTilesY; y++) {
    for (let x = 0; x < totalTilesX; x++) {
      const tile = mapObjList[y][x];
      if (tile == 256) continue;

      const imgX = tile % tilesetImgW;
      const imgY = Math.floor(tile / tilesetImgW);

      imageCtx.drawImage(
        tileset["overworld_obj"],
        imgX * basesprSize,
        imgY * basesprSize,
        basesprSize,
        basesprSize,
        x * basesprSize,
        y * basesprSize,
        basesprSize,
        basesprSize,
      );
    }
  }

  const imgData = imageCanvas.toDataURL("image/png");

  const mapName = prompt("Insert screenshot name:");

  const a = document.createElement("a");
  a.href = imgData;
  a.download = `${mapName}.png`;
  a.click();
}

const exportButton = document.createElement("button");
exportButton.textContent = "Map";
exportButton.onclick = exportMap;
document.body.appendChild(exportButton);

const uploadInput = document.createElement("input");
uploadInput.type = "file";
uploadInput.accept = ".txt"; // Restrict to .txt files
uploadInput.onchange = importMapList;
document.body.appendChild(uploadInput);
