//Render and loop ahh things

import {
  projectProp,
  tileset,
  camera,
  linkProp,
  tilesetImgW,
  sprSize,
  basesprSize,
  hudImg,
} from "./config.js";
import {
  worldGenType,
  generateWorld,
  mapGroundList,
  mapObjList,
  perChunkWorld,
  tileAnim,
  biomeTypes,
} from "./world.js";
import { _update } from "./engine.js";
import { mouse } from "./input.js";

const canvas = document.getElementById("gamelmao");
canvas.width = 640;
canvas.height = 576;
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false; //I WANT NICE SPRITES :))))))

export let devMode = {
  //some dev tools
  on: true,
  debugTxt: true,
  showlinkColl: false,
  linkColl: true,
  showItemColl: false,
  hideObj: false,
  hideGrnd: false,
  hideHud: false,
  hideEntities: false,
};

//TODO: Add a Gameboy color on background behind the screen
//It makes the game looks more with the original Awakening

//TODO: Make layers for the tiles:
/*
    Layer render for them {
        1-Ground tiles (made!)
        2-Walls - Objects (made!)
        2-Ground Items - Also in the Layer 2
    }
    4-Dropped Items
    5-Entities (Enemies, Player, etc..) (made!)
*/

//print the game name on the console guys!
console.log("Zelda Survival (change name later)");
console.log(
  "Version " +
    projectProp.verMajor +
    "." +
    projectProp.verMinor +
    "." +
    projectProp.verPatch +
    " - " +
    projectProp.verDescrp,
);

if (worldGenType == 0) {
  console.log("World Gen Type: Random");
} else if (worldGenType == 1) {
  console.log("World Gen Type: Noise");
}

//10 tiles of left to right
//8 tiles of up to down (not 9, the last is used for hud, which for some reason is also part of the map)

//yeah, it needs to call this function

tileset["overworld"].onload = () => {
  console.log("Oh browser browser, can you start pretty please?");
};

let lastTime = performance.now();
let fps = 0;

generateWorld();
gameLoop(); //only starts the game when the image load

function gameLoop() {
  const currentTime = performance.now();
  let deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  fps = Math.round(1000 / deltaTime);

  _update(deltaTime); //what constantly calls the loop
  _draw();

  requestAnimationFrame(gameLoop);
}

function drawPlayer() {
  let plyoffsetX = 0;
  let plyoffsetY = 0;
  if (
    playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][3] !==
    undefined
  ) {
    plyoffsetX =
      playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][3];
  }
  if (
    playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][4] !==
    undefined
  ) {
    plyoffsetY =
      playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][4];
  }
  if (linkSpr.complete) {
    ctx.drawImage(
      linkSpr,
      playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][0] *
        basesprSize,
      playerSprites[linkProp.direction][linkProp.fState][linkProp.frame][1] *
        basesprSize,
      basesprSize,
      basesprSize,
      linkProp.x + plyoffsetX * (sprSize / basesprSize),
      linkProp.y + plyoffsetY * (sprSize / basesprSize),
      sprSize,
      sprSize,
    );
    //ctx.fillRect(linkProp.sclxP+linkProp.x, linkProp.sclyP+linkProp.y, linkProp.sclx, linkProp.scly); //this is for link's collision your dumbass
  }

  if (linkProp.fState === 2) {
    ctx.save();

    if (
      itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]] !==
        undefined &&
      itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]]
        .length !== 0
    ) {
      let offsetX =
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][0] *
        (sprSize / basesprSize);
      let offsetY =
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][1] *
        (sprSize / basesprSize);
      let spriteX =
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][2];
      let spriteY =
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][3];

      let drawX = linkProp.x + plyoffsetX * (sprSize / basesprSize) + offsetX;
      let drawY = linkProp.y + plyoffsetY * (sprSize / basesprSize) + offsetY;

      let mirrorX = 0;
      let mirrorY = 0;

      if (
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][4]
      ) {
        mirrorX = -1;
      } else {
        mirrorX = 1;
      }
      if (
        itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
          linkProp.direction
        ][linkProp.frame][5]
      ) {
        mirrorY = -1;
      } else {
        mirrorY = 1;
      }

      if (devMode.showItemColl && devMode.on) {
        let hitboxX =
          linkProp.x +
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].offX *
            (sprSize / basesprSize);
        let hitboxY =
          linkProp.y +
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].offY *
            (sprSize / basesprSize);
        let hitboxSclx =
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].sclx *
          (sprSize / basesprSize);
        let hitboxScly =
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].scly *
          (sprSize / basesprSize);
        let hitboxSclxP =
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].sclxP;
        let hitboxSclyP =
          itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
            linkProp.direction
          ][
            itemsSprProp[linkProp.handItem[linkProp.useItem == 1 ? "A" : "B"]][
              linkProp.direction
            ].length - 1
          ].sclyP;

        let itemObj = {
          x: hitboxX,
          y: hitboxY,
          sclx: hitboxSclx,
          scly: hitboxScly,
          sclxP: hitboxSclxP,
          sclyP: hitboxSclyP,
        };

        if (devMode.showItemColl) {
          ctx.fillStyle = "#ff0000";
          ctx.fillRect(itemObj.x, itemObj.y, itemObj.sclx, itemObj.scly);
          ctx.fillStyle = "#00ff00";
          ctx.fillRect(
            itemObj.x + itemObj.sclxP,
            itemObj.y + itemObj.sclyP,
            itemObj.sclx,
            itemObj.scly,
          );
        }
      }

      //if (linkProp.useItem==1 ? 'A' : 'B'==0)
      ctx.translate(drawX + sprSize / 2, drawY + sprSize / 2);
      ctx.scale(mirrorX, mirrorY);
      ctx.drawImage(
        itemSpr,
        spriteX * basesprSize,
        spriteY * basesprSize,
        basesprSize,
        basesprSize,
        -sprSize / 2,
        -sprSize / 2,
        sprSize,
        sprSize,
      );
    }
    ctx.restore();
  }
}

function drawHud() {
  if (hudImg.complete) {
    //main A and B buttons
    ctx.drawImage(
      hudImg,
      0,
      0,
      basesprSize * 2 + 1,
      basesprSize,
      sprSize / basesprSize,
      512,
      sprSize * 2,
      sprSize,
    );
    ctx.drawImage(
      hudImg,
      linkProp.handItem[0] * (basesprSize / 2),
      basesprSize,
      basesprSize / 2,
      basesprSize,
      sprSize / basesprSize + basesprSize * 2 - sprSize / basesprSize,
      512,
      sprSize / 2,
      sprSize,
    );
    ctx.drawImage(
      hudImg,
      basesprSize * 2 + 1,
      0,
      basesprSize * 2 + 1,
      basesprSize,
      sprSize / basesprSize + sprSize * 2 + 7 * 4,
      512,
      sprSize * 2,
      sprSize,
    );
    ctx.drawImage(
      hudImg,
      linkProp.handItem[1] * (basesprSize / 2),
      basesprSize,
      basesprSize / 2,
      basesprSize,
      sprSize / basesprSize +
        sprSize * 2 +
        7 * 4 +
        basesprSize * 2 -
        sprSize / basesprSize,
      512,
      sprSize / 2,
      sprSize,
    );
    //rupees counter (I need to use Rupees for something)
    ctx.drawImage(
      hudImg,
      (basesprSize / 2) * 9,
      0,
      basesprSize / 2,
      basesprSize / 2,
      81 * (sprSize / basesprSize),
      512,
      sprSize / 2,
      sprSize / 2,
    );
    //the numbers guys
    let rupeeList = linkProp.rupees.toString().split("");
    let rupeeLen = linkProp.rupees.toString().length;
    //TODO: Make the numbers always have 3 houses, for example: 5 become 005
    for (let i = 0; i < rupeeLen; i++) {
      ctx.drawImage(
        hudImg,
        4 * (basesprSize / 2) + rupeeList[i] * (basesprSize / 2),
        (basesprSize / 2) * 4,
        basesprSize / 2,
        basesprSize / 2,
        81 * (sprSize / basesprSize) + i * (8 * (sprSize / basesprSize)),
        512 + 8 * (sprSize / basesprSize),
        sprSize / 2,
        sprSize / 2,
      );
    }
    //The hearts that are in the hud

    let xDraw = 0;
    let yDraw = 0;
    let fixLife = false;
    if (!Number.isInteger(linkProp.hp)) {
      fixLife = true;
    }
    let mainLife = Math.floor(linkProp.hp);
    for (let i = 0; i < linkProp.maxHP; i++) {
      xDraw =
        81 * (sprSize / basesprSize) +
        (sprSize / 2) * 3 +
        i * (8 * (sprSize / basesprSize));
      yDraw = 512 + (sprSize / 2) * Math.floor(i / 7);
      ctx.drawImage(
        hudImg,
        basesprSize / 2,
        basesprSize * 2,
        basesprSize / 2,
        basesprSize / 2,
        xDraw,
        yDraw,
        sprSize / 2,
        sprSize / 2,
      );
    }
    if (mainLife == 0) {
      for (let i = 0; i < 1; i++) {
        //repeat for me
        xDraw =
          81 * (sprSize / basesprSize) +
          (sprSize / 2) * 3 +
          i * (8 * (sprSize / basesprSize));
        yDraw = 512 + (sprSize / 2) * Math.floor(i / 7);
        ctx.drawImage(
          hudImg,
          (basesprSize / 2) * 2,
          basesprSize * 2,
          basesprSize / 2,
          basesprSize / 2,
          xDraw,
          yDraw,
          sprSize / 2,
          sprSize / 2,
        );
      }
    } else {
      for (let i = 0; i < mainLife; i++) {
        //repeat for me
        xDraw =
          81 * (sprSize / basesprSize) +
          (sprSize / 2) * 3 +
          i * (8 * (sprSize / basesprSize));
        yDraw = 512 + (sprSize / 2) * Math.floor(i / 7);
        ctx.drawImage(
          hudImg,
          (basesprSize / 2) * 3,
          basesprSize * 2,
          basesprSize / 2,
          basesprSize / 2,
          xDraw,
          yDraw,
          sprSize / 2,
          sprSize / 2,
        );
        if (fixLife) {
          if (i + 1 == mainLife) {
            i++;
            xDraw =
              81 * (sprSize / basesprSize) +
              (sprSize / 2) * 3 +
              i * (8 * (sprSize / basesprSize));
            yDraw = 512 + (sprSize / 2) * Math.floor(i / 7);
            ctx.drawImage(
              hudImg,
              (basesprSize / 2) * 2,
              basesprSize * 2,
              basesprSize / 2,
              basesprSize / 2,
              xDraw,
              yDraw,
              sprSize / 2,
              sprSize / 2,
            );
          }
        }
      }
    }
  }
}

function drawScene() {
  if (tileset["overworld"].complete) {
    //BUG FIX GUYS!!1!
    let imgX = 0;
    let imgY = 0;
    let cameraOffY = camera.offsetY - 1;
    let cameraOffX = camera.offsetX - 1;
    for (let y = 0; y < 8 * 3; y++) {
      //if((camera.offsetY*8)*2<=mapGroundList.length) {
      if (y + cameraOffY * 8 < 0 || y + cameraOffY * 8 > mapGroundList.length) {
        continue;
      }
      if (!devMode.on || (devMode.on && !devMode.hideGrnd)) {
        for (let x = 0; x < 10 * 3; x++) {
          //if ((y * sprSize)+camera.y-(camera.offsetY*(8*sprSize))<768 || (x * sprSize)+camera.x-(camera.offsetX*(10*sprSize))<896) {
          if (
            x + cameraOffX * 10 < 0 ||
            x + cameraOffX * 10 > mapGroundList[y].length
          ) {
            continue;
          }
          let tile = mapGroundList[y + cameraOffY * 8][x + cameraOffX * 10];
          //tilesetImgW = tileset["overworld"].naturalWidth / 16;
          //tilesetImgH = tileset["overworld"].naturalHeight / 16;
          imgX = tile % tilesetImgW; // Compute horizontal frame
          imgY = Math.floor(tile / tilesetImgW); // Compute vertical frame
          if (
            x * sprSize + camera.x - 10 * sprSize >= -sprSize ||
            x * sprSize + camera.x - 10 * sprSize <= sprSize * 11 ||
            y * sprSize + camera.y - 8 * sprSize >= -sprSize ||
            y * sprSize + camera.y - 8 * sprSize <= sprSize * 11
          ) {
            if (tile == 48 || tile == 54 || tile == 51 || tile == 57) {
              switch (tileAnim.frame) {
                case 1:
                  imgX += 1;
                  break;
                case 2:
                  imgX += 2;
                  break;
                case 3:
                  imgY += 1;
                  break;
              }
            }

            ctx.drawImage(
              tileset["overworld"],
              imgX * basesprSize,
              imgY * basesprSize,
              basesprSize,
              basesprSize,
              x * sprSize + camera.x - 80 * 8,
              y * sprSize + camera.y - 64 * 8,
              sprSize,
              sprSize,
            );
          }
          /* if (checkCollisionInTiles(linkProp, (x * sprSize)+camera.x-(camera.offsetX*(10*sprSize)), sprSize, (y * sprSize)+camera.y-(camera.offsetY*(8*sprSize)), sprSize)) {
								ctx.globalAlpha = 0.5;
								ctx.fillRect((x * sprSize)+camera.x-(camera.offsetX*(10*sprSize)),(y * sprSize)+camera.y-(camera.offsetY*(8*sprSize)), sprSize, sprSize);
								ctx.globalAlpha = 1;
							} */
          //} else {
          //break;
          //}
        }
      }
      //}
    }
    for (let y = 0; y < 8 * 3; y++) {
      if (y + cameraOffY * 8 < 0 || y + cameraOffY * 8 > mapObjList.length) {
        continue;
      }
      if (!devMode.on || (devMode.on && !devMode.hideObj)) {
        for (let x = 0; x < 10 * 3; x++) {
          //if ((y * sprSize)+camera.y-(camera.offsetY*(8*sprSize))<768 || (x * sprSize)+camera.x-(camera.offsetX*(10*sprSize))<896) {
          if (
            x + cameraOffX * 10 < 0 ||
            x + cameraOffX * 10 > mapObjList[y].length
          ) {
            continue;
          }
          let tile = mapObjList[y + cameraOffY * 8][x + cameraOffX * 10];
          //tilesetImgW = tileset["overworld_obj"].naturalWidth / 16;
          //tilesetImgH = tileset["overworld_obj"].naturalHeight / 16;
          imgX = tile % 16; // Compute horizontal frame
          imgY = Math.floor(tile / 16); // Compute vertical frame
          if (
            x * sprSize + camera.x - 10 * sprSize >= -sprSize ||
            x * sprSize + camera.x - 10 * sprSize <= sprSize * 11 ||
            y * sprSize + camera.y - 8 * sprSize >= -sprSize ||
            y * sprSize + camera.y - 8 * sprSize <= sprSize * 11
          ) {
            ctx.drawImage(
              tileset["overworld_obj"],
              imgX * basesprSize,
              imgY * basesprSize,
              basesprSize,
              basesprSize,
              x * sprSize + camera.x - 10 * 8 * 8,
              y * sprSize + camera.y - 8 * 8 * 8,
              sprSize,
              sprSize,
            );
          }
          //} else {
          //break;
          //}
        }
      }
    }
  }
}

function _draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //it cleans the screen
  ctx.fillStyle = "#ffffff";
  drawScene();
  linkProp.draw(ctx); //drawPlayer();
  ctx.fillStyle = "#ff0000";
  ctx.globalAlpha = 0.5;
  //ctx.fillRect((playerMapXPos-(camera.offsetX*10))*sprSize, (playerMapYPos-(camera.offsetY*8))*sprSize, sprSize, sprSize);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000000";
  //drawPlayer();
  //the hud is behind the player for some reason
  //remember to move it back after the tests
  ctx.fillStyle = "#FFFF8C";
  ctx.fillRect(0, 512, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  if (!devMode.on || (devMode.on && !devMode.hideHud)) {
    drawHud();
  }
  if (devMode.on && devMode.debugTxt) {
    let playerMapXPos = Math.round(linkProp.x / sprSize + camera.offsetX * 10);
    let playerMapYPos = Math.round(linkProp.y / sprSize + camera.offsetY * 8);
    ctx.fillText(`Current Tile Animation Frame: ${tileAnim.frame}`, 0, 570);
    ctx.fillText(
      `Mouse X: ${mouse.x} Y: ${mouse.y} down: ${mouse.down}`,
      0,
      20,
    );
    ctx.fillText(
      `Current Biome: ${biomeTypes[perChunkWorld[camera.offsetY][camera.offsetX]]}`,
      0,
      30,
    );
    ctx.fillText(
      `Camera Offset X: ${camera.offsetX} Y: ${camera.offsetY}`,
      0,
      40,
    );
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(
		`X: ${linkProp.x} Y: ${linkProp.y} Animation Name: ${linkProp.animName}`,
		0,
		50
	);
	ctx.fillText(
		`Direction: ${linkProp.direction} Sclx: ${linkProp.sclx} Scly: ${linkProp.scly}`,
		0,
		60
	);
	ctx.fillText(
		`State: ${linkProp.state} HP: ${linkProp.hp} Max HP: ${linkProp.maxHp}`,
		0,
		70
	);
	ctx.fillText(
		`Rupees: ${linkProp.rupees} A Item: ${linkProp.handItem.A} B Item: ${linkProp.handItem.B}`,
		0,
		80
	);
	ctx.fillText(
		`Frame: ${linkProp.anim.frame} Timer: ${linkProp.anim.timer} Delay: ${linkProp.anim.delay} Max Frame: ${linkProp.anim.maxFrame} current anim: ${linkProp.anim.currAnim}`,
		0,
		90
	)
  }
}
