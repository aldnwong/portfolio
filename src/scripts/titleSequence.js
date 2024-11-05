import config from '../config/config.json';

const {
	words, 
	unhighlighted, 
	typeTime,
	deleteTime,
	switchTime
} = config.sequence;

const whoAmIElement = document.getElementById("whoAmIText");
const cursorElement = document.getElementById("blinkingCursor");

async function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("Done");
		}, ms)
	});
}

async function typeWord(word) {
	return new Promise(async(resolve) => {
		cursorElement.classList.add("paused");
		const letterArray = word.split("");
		for await (const letter of letterArray) {
			console.log(letter);
			whoAmIElement.innerHTML = whoAmIElement.innerHTML + letter;
			await wait(typeTime);
		}
		cursorElement.classList.remove("paused");
		resolve("Done!");
	})
}

async function deleteWord() {
	return new Promise(async(resolve) => {
		// TODO: finish this
		resolve("aa")
	})
}

async function highlightWord(word) {
	return new Promise(async(resolve) => {
		console.log("Highlighting word ");
		console.log("Deleted!");
		resolve("Done!");
	})
}

// I hate JavaScript.

while(true) {
	for await (const i of words) {
		let typePromise = typeWord(i);
		let highlightPromise;
		if (i != unhighlighted) {
			highlightPromise = highlightWord(i);
		}
		else {
			highlightPromise = new Promise((resolve) => resolve());
		}
		
		await Promise.all(await typePromise, await highlightPromise);

		await wait(switchTime);

		let deletePromise = deleteWord(i);
		await Promise.all(await deletePromise);

		console.log(" --- ok! --- ")
	}
}