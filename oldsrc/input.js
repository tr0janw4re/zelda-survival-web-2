//For event listeners and state of the keyboard and mouse

import { generateMapImage } from "./world.js";
import { devMode } from "./main.js";

const keys = {}; //the keys that exist
const keyPr = {}; //the key is pressed?

class Input {
  constructor(keybinds) {
    this.keylist = keybinds;
    console.log(keybinds);

    this.left = false;
    this.down = false;
    this.up = false;
    this.right = false;

    this.a = false;
    this.b = false;

    this.select = false;
    this.start = false;
  }

  update(deltaTime) {
    this.right =
      keys[this.keylist.right] === undefined ||
      keys[this.keylist.right] === false
        ? false
        : true;
    this.left =
      keys[this.keylist.left] === undefined || keys[this.keylist.left] === false
        ? false
        : true;
    this.up =
      keys[this.keylist.up] === undefined || keys[this.keylist.up] === false
        ? false
        : true;
    this.down =
      keys[this.keylist.down] === undefined || keys[this.keylist.down] === false
        ? false
        : true;

    this.a =
      keys[this.keylist.a] === undefined || keys[this.keylist.a] === false
        ? false
        : true;
    this.b =
      keys[this.keylist.b] === undefined || keys[this.keylist.b] === false
        ? false
        : true;

    this.select =
      keys[this.keylist.select] === undefined ||
      keys[this.keylist.select] === false
        ? false
        : true;
    this.start =
      keys[this.keylist.start] === undefined ||
      keys[this.keylist.start] === false
        ? false
        : true;
  }
}

let inputKeys = {
  up: "w",
  left: "a",
  down: "s",
  right: "d",
  a: "n",
  b: "b",
  select: "shift",
  start: "enter",
};

export let controls = new Input(inputKeys);

export let mouse = {
  //mouse position
  x: 0,
  y: 0,
  down: false,
};

window.addEventListener("beforeunload", (ev) => {
  if (!devMode.on) {
    ev.preventDefault();
  }
});

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
  keyPr[event.key] = true;
  console.log("Jimmy Five");
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
  if (event.key == "p") {
    generateMapImage();
  }
});

document.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX - 8;
  mouse.y = event.clientY - 8;
});

document.addEventListener("touchmove", function (event) {
  mouse.x = event.clientX - 8;
  mouse.y = event.clientY - 8;
});

document.addEventListener("mousedown", () => {
  mouse.down = true;
});

document.addEventListener("mouseup", () => {
  mouse.down = false;
});

document.addEventListener("touchstart", () => {
  mouse.down = true;
});

document.addEventListener("touchend", () => {
  mouse.down = false;
});
