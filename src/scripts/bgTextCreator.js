import config from '../config/config.json';
const {lineAmount, textOptions, switchTime, opacityHide, opacityShow} = config.backgroundText;
var elements = [];

for (let i = 0; i < lineAmount; i++) {
    var element = document.createElement("h2");
    document.getElementById("backgroundTextElement").appendChild(element);
    element.classList.add("hide");
    elements[i] = element;
}

let first = true;

async function runBgSequence() {
    for await (const textFile of textOptions) {
        await fetch(textFile)
            .then(async(result) => {
                if (result.status == 404) return;
                var text = await result.text();
                var lines = text.replaceAll("\t", "   ").split("\n");
                let i = 0;
                for await (const line of lines) {
                    if (i >= lineAmount) break;
                    elements[i].style.opacity = opacityHide;
                    if (!first) await wait(switchTime);
                    elements[i].textContent = line;
                    elements[i].style.opacity = opacityShow;
                    i++;
                }
                if (first) first = false;
            })
            .catch((error) => console.error(error));
    }
}

async function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms)
	});
}

export { runBgSequence }