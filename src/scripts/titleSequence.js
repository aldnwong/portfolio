import config from '../config/config.json';
const { words, noDeterminer, typeTime, deleteTime, switchTime } = config.sequence;
const whoAmIElement = document.getElementById("whoAmIText");
const cursorElement = document.getElementById("blinkingCursor");

async function runTitleSequence() {
	for await (const i of words) {
		const determiner = !noDeterminer.includes(i);
		let typeDeterminer = (determiner && whoAmIElement.innerHTML.length == 0);
		
		if (!determiner && whoAmIElement.innerHTML.length != 0) {
			await deleteWord("a ");
		}
	
		await typeWord((typeDeterminer) ? "a " + i : i);
		await wait(switchTime);
		await deleteWord(i);
	}
}

async function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms)
	});
}


async function typeWord(word) {
	return new Promise(async(resolve) => {
		cursorElement.classList.add("paused");
		for await (const letter of word.split("")) {
			await wait(typeTime);
			whoAmIElement.innerHTML = whoAmIElement.innerHTML + letter;
		}
		cursorElement.classList.remove("paused");
		resolve();
	})
}

async function deleteWord(word) {
	return new Promise(async(resolve) => {
		let counter = 0;
		while(true) {
			if (++counter > word.length) break;
			await wait(deleteTime);
			whoAmIElement.innerHTML = whoAmIElement.innerHTML.substring(0, whoAmIElement.innerHTML.length-1);
		}
		resolve();
	})
}

export { runTitleSequence }

// I hate JavaScript.