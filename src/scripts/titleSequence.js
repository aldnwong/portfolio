import config from '../config/config.json';

const {
	words, 
	unhighlighted, 
	typeTime} = config.sequence;
const unhighlightedWord = config.sequence.unhighlighted;
var deleteTime = config.sequence.deleteTime;
var switchTime = config.sequence.switchTime;
const obfLetters = config.sequence.obfuscationSymbols;
const highlightColor = config.backgroundText.highlightedColor;
const bgColor = config.backgroundText.color;
const reducedModeThreshold = config.sequence.reducedModeThreshold;
const bgTextTransitionTime = config.backgroundText.transitionTime;
var doHighlight = true;
var doSpeedTest = true;
const switchElement = document.getElementById("foregroundWordSwitch");
const cursorElement = document.getElementById("foregroundWordCursor");

console.log(words);