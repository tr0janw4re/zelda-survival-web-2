//this is what makes the sounds

const soundCtx = new AudioContext();

const freqList = [
	16.35, //C
	17.32, //C#
	18.35, //D
	19.45, //D#
	20.60, //E
	21.83, //F
	23.12, //F#
	24.50, //G
	25.96, //G#
	27.50, //A
	29.14, //A#
	30.87, //B
];

const keyList = [
	"q", //C
	"2", //C#
	"w", //D
	"3", //D#
	"e", //E
	"r", //F
	"5", //F#
	"t", //G
	"6", //G#
	"y", //A
	"7", //A#
	"u", //B
	"i", //C 2
	"9", //C# 2
	"o", //D 2
	"0", //D# 2
	"p", //E 2
];

let octave = 4;
let playing = false;
let channels = [[]];
let osc = null;

function getNote(note, oct) {
	if (note!==undefined && note>=0) {
		let n = (note - (freqList.length*Math.floor(note/freqList.length)));
		console.trace(`n: ${n} note: ${note}`);
		let o = oct + Math.floor(note/freqList.length);
		return freqList[n]*Math.pow(2, o);
	} else {
		console.trace(`Error: Note is invalid: ${note}`);
	}
}

function createOsc(note, oct) {
	const oscc = soundCtx.createOscillator();
	oscc.type = "square";
	oscc.frequency.setValueAtTime(getNote(note, oct), soundCtx.currentTime);
	oscc.connect(soundCtx.destination);
	return oscc
}

function destroyChannels() {
	for (let i=0; i<channels.length; i++) {
		channels[i].osc.stop();
	}
	channels = [];
}

function stopSound(chan) {
	if (channels[chan]) {
		channels[chan].stop();
		channels[chan].disconnect();
		channels[chan] = [];
		checkChannels();
		console.log("stopped");
	} else {
		console.trace("this channel doesnt exist");
	}
}

function playSound(chan, note, oct) {
	let checkChan = channels[chan] instanceof OscillatorNode
	if (!checkChan || !channels[chan]) {
		channels[chan] = createOsc(note, oct);
		channels[chan].start();
		console.log("playing");
	} else {
		console.trace("this channel is occupied");
	}
}

function checkChannels() {
	console.trace(`channel len: ${channels.length}`);
	for (let i=0; i<channels.length; i++) {
		console.trace(`this channel len: ${channels[i].length}`);
		if (channels[i].length==0 && !channels[i+1]) {
			channels.splice(i, i);
		}
	}
	console.trace(`channel len: ${channels.length}`);
}

/*
document.addEventListener("keydown", function(event) {
	function makeIt() {
		for (let i=0; i<keyList.length; i++) {
			if (event.key==keyList[i]) {
				channels.push({
					key: event.key,
					osc: createOsc(i, octave)
				});
				channels.at(-1).osc.start();
				console.log(`playing: ${playing} channel: ${channels.length-1}`);
			}
		}
	}
	if (channels.length>0) {
		let thing = false;
		for (let i=0; i<channels.length; i++) {
			if (event.key===channels[i].key) {
				thing = true;
			}
		}
		if (!thing) { 
			makeIt();
		}
	} else {
		makeIt();
	}
});

document.addEventListener("keyup", function(event) {
	function makeIt(channel) {
		console.trace(channels);
		stopSound(channel);
		channels.splice(channel, channel);
		playing = false;
		console.log(`playing: ${playing}`);
	}
	
	if (channels.length>0) {
		let thing = false;
		let chan = 0;
		for (let i=0; i<channels.length; i++) {
			if (event.key===channels[i].key) {
				thing = true;
				chan = i;
			}
		}
		if (thing) { 
			makeIt(chan);
		}
	} else {
		makeIt();
	}
	
})
*/