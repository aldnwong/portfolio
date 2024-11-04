// IMPORT CONFIG, GET WORDS LIST
import config from '../config/config.json';
const words = config.words;

// SET OBFUSCATED WORDS LETTERING
const obfLetters = config.obfuscationSymbols;

// CREATE AND SET h2 ELEMENTS
const bgTextElementsAmt = config.bgTextElementsAmt;
const h2MarginMax = config.h2MarginMax;
const transition = config.h2Transition;
const h2LineLength = config.h2LineLength;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.remove('hide');
        }
        else {
            entry.target.classList.remove('show');
            entry.target.classList.add('hide');
        }
    });
});

for (let i = 0; i < bgTextElementsAmt; i++) {
    var obfuscated = [];
    // CREATE OBFUSCATED WORDS
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        var obfWord = "";
        let lastRand = Math.floor(Math.random()*obfLetters.length);
        for (let j = 0; j < word.length; j++) {
            let rand = Math.floor(Math.random()*obfLetters.length);
            while (rand == lastRand) rand = Math.floor(Math.random()*obfLetters.length);
            lastRand = rand;
            obfWord += obfLetters.charAt(rand);
        }
        obfuscated[i] = obfWord;
    }

    // CREATE h2 ELEMENT
    var element = document.createElement("h2")
    var parentElement = document.getElementById("backgroundTextElement");
    parentElement.appendChild(element)
    observer.observe(element);

    // SET INNER HTML
    var text = "";
    var startingIndex = Math.floor(Math.random()*words.length);

    // CHANGE STARTING INDEX SO ITS MORE RANDOM
    if (startingIndex == 0 || startingIndex == 1) {
        for (let j = 1; j < words.length; j++) {
            text += "<span class='"+words[j]+"'>"+obfuscated[j]+"</span>"; 
        }
    }
    else if (startingIndex == words.length) {
        for (let j = words.length-1; j > 0; j--) {
            text += "<span class='"+words[j]+"'>"+obfuscated[j]+"</span>"; 
        }
    }
    else {
        for (let j = startingIndex; j < words.length; j++) {
            text += "<span class='"+words[j]+"'>"+obfuscated[j]+"</span>"; 
        }
        for (let k = 1; k < startingIndex; k++) {
            text += "<span class='"+words[k]+"'>"+obfuscated[k]+"</span>"; 
        }
    }

    // SET THE INNER HTML AND RANDOMIZE MARGIN & TRANSFORM SO IT SHIFTS. WHY AM I YELLING IN THESE COMMENTS. I GUESS IT MAKES IT FEEL MORE OFFICIAL? IDK LMAO
    while (element.textContent.length < h2LineLength) {
        element.innerHTML += text;
    }
    element.style.marginLeft = (Math.random()*h2MarginMax)+"vw";
    element.style.transition = transition+"s";
    element.classList.add("bgTE");
}