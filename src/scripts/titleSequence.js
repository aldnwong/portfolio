/*

    i really hope i never have to debug this again
	(i will definitely have to debug this again)

*/

// IMPORT CONFIG VALUES
import config from '../config/config.json';
const words = config.words;
const unhighlightedWord = config.unhighlighted;
var typeTime = config.typeTime;
var deleteTime = config.deleteTime;
var switchTime = config.switchTime;
const obfLetters = config.obfuscationSymbols;
const highlightColor = config.highlightColor;
const bgColor = config.bgColor;
const bgTextTransitionTime = config.bgTextTransitionTime;
const reducedModeThreshold = config.reducedModeThreshold;
var doHighlight = true;
var doSpeedTest = true;

// GET DOCUMENT ELEMENTS
const switchElement = document.getElementById("foregroundWordSwitch");
const cursorElement = document.getElementById("foregroundWordCursor");

// BOOLS TO WAIT FOR BOTH FUNCTIONS TO FINISH
var titleChangeFinished = false;
var highlightChangeFinished = false;

// DEFINE TYPING SEQUENCE PER WORD
function typeSequence(word, indPos) {

	// SET TEXT ARRAY AND INIT TEXT ELEMENT
	var textArray = Array.from(word);
	var text = "";
	if (indPos == 2) textArray = Array.from("a "+word);
	else if (indPos == 0 || indPos == 3) text = "a ";
	if (word == unhighlightedWord) textArray = Array.from(word);

	// DEFINE TYPING SEQUENCE
	function runType(i) {
		if (i < textArray.length) {
			setTimeout(function() {
				cursorElement.classList.add("paused");

				text += textArray[i];
				switchElement.textContent = text;
				runType(i+1);
			}, typeTime)
		} else { // WORD HAS BEEN TYPED, RUN CLEAR
			// RESUME CURSOR ANIMATION
			cursorElement.classList.remove("paused");

			setTimeout(function() {
				var lenShift = switchElement.textContent.length;
				if (indPos == 0 || indPos == 2) lenShift = switchElement.textContent.length-2;
				runClear(lenShift);
			} , switchTime);
		}
	}

	// DEFINE CLEARING SEQUENCE
	function runClear(j) {
		if (j > 0) {
			setTimeout(function() {
				cursorElement.classList.add("paused");

				var clearText = switchElement.textContent.slice(0, -1);
				switchElement.textContent = clearText;
				runClear(j-1);
			}, deleteTime)
		}
		else { // WORD HAS BEEN TYPED, RUN CLEAR
			// RESUME CURSOR ANIMATION
			cursorElement.classList.remove("paused");

			titleChangeFinished = true;
		}
	}

	// RUN SEQUENCE STARTING WITH TYPING
	runType(0);
}

function replaceAt(text, char, index) {
    return text.substr(0, index) + char + text.substr(index + 1);
}

let lastRand = Math.floor(Math.random()*obfLetters.length);
// HIGHLIGHT BG ELEMENTS SEQUENCE 
function highlightSequence(word, element) {
	element.style.color = highlightColor;
	element.style.transition = bgTextTransitionTime;
	// SET TEXT ARRAY AND INIT TEXT ELEMENT
	var textArray = Array.from(word);

	// DEFINE HIGHLIGHT SEQUENCE
	function runHighlight(i) {
		if (i < textArray.length) {
			setTimeout(function() {
				element.textContent = replaceAt(element.textContent, textArray[i], i);
				runHighlight(i+1);
			}, typeTime)
		} else { // WORD HAS BEEN HIGHLIGHTED, OBFUSCATE AND CHANGE COLOR
			setTimeout(function() {
				element.style.color = bgColor;
				runObfuscate(element.textContent.length);
			} , switchTime);
		}
	}

	// DEFINE OBFUSCATE SEQUENCE
	function runObfuscate(j) {
		if (j > 0) {
			setTimeout(function() {
				let rand = Math.floor(Math.random()*obfLetters.length);
        		while (rand == lastRand) rand = Math.floor(Math.random()*obfLetters.length);
				element.textContent = replaceAt(element.textContent, obfLetters.charAt(rand), j-1);
				runObfuscate(j-1);
			}, deleteTime)
		}
		else { // WORD HAS BEEN OBFUSCATED, SET BOOL
			highlightChangeFinished = true;
		}
	}

	// RUN SEQUENCE
	runHighlight(0);
}

// FUNCTION FOR RUNNING HIGHLIGHT + TITLE CHANGER FOR EACH WORD IN LIST
function sequence(i) {
	const start = Date.now();
	var inFocus = document.hasFocus();
	highlightChangeFinished = false;
	titleChangeFinished = false;

	if (i < words.length) {
		const wordLength = Array.from(words[i]).length;
		const expectedTime = (wordLength*typeTime)+(wordLength*deleteTime)+switchTime

		var indPos = 0; // 0 for normal, 1 for first, 2 for first highlighted, 3 for last
		if (i == 0) indPos = 1;
		else if (i == 1) indPos = 2;
		else if (i == words.length-1) indPos = 3;
		typeSequence(words[i], indPos);
		if (words[i] != unhighlightedWord && doHighlight) {
			const hightlightedElements = document.getElementsByClassName(words[i]);
			for (let k = 0; k < hightlightedElements.length; k++) {
				highlightSequence(words[i], hightlightedElements[k]);
			}
		} else {
			highlightChangeFinished = true
		};
		function wait() {
			if (!titleChangeFinished || !highlightChangeFinished) {
				inFocus = (inFocus && document.hasFocus())
				setTimeout(wait, 50);
				return;
			} else {
				const end = Date.now();
				const delay = (end - start)-expectedTime;
				inFocus = (inFocus && document.hasFocus())
				if (delay > reducedModeThreshold && doHighlight && inFocus && doSpeedTest) {
					console.log(`Delay of ${delay} ms was higher than the ${reducedModeThreshold} ms threshold. Switching to reduced mode.`);
					document.getElementById("backgroundTextElement").classList.add("disabled");
					document.getElementById("reducedWarning").style.display = "block";
					document.getElementById("foregroundWordCursor").style.display = "none";
					document.getElementById("fgImage").style.opacity = "100%";
					switchTime = config.switchTime * 1.85;
					typeTime = config.typeTime + 40;
					deleteTime = config.deleteTime + 40;
					doHighlight = false;

					sequence(i+1);
				} else {
					sequence(i+1);
				}
			}
		}
		wait();
	} else {
		sequence(0);
	}
}

document.getElementById("disableReduced").onclick = function() {
	document.getElementById("backgroundTextElement").classList.remove("disabled");
	document.getElementById("reducedWarning").style.display = "none";
	document.getElementById("foregroundWordCursor").style.display = "inline";
	switchTime = config.switchTime;
	typeTime = config.typeTime;
	deleteTime = config.deleteTime;
	doHighlight = true;
	doSpeedTest = false;
}

// RUN SEQUENCE
sequence(0);