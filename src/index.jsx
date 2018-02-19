/* @flow */
/* eslint-disable no-console */

import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

if (!document.body) {
    throw new Error("This document has no body 👀");
}

const body: HTMLElement = document.body;

const myDiv = document.createElement("div");
body.appendChild(myDiv);

ReactDOM.render(<h1>AM I USING REACT NOW?</h1>, myDiv);

// module.hot.accept();

const emojis = document.createElement("p");
emojis.innerText = "👀";
myDiv.appendChild(emojis);

function flowwwy(a: string, b: number) {
    return a + b;
}

// $FlowFixMe
flowwwy("asdf", "sdffs");

const arr = [...Array(20)];

const p = document.createElement("p");

let ptext = "";
arr.forEach(() => {
    ptext += `${Math.floor(Math.random() * 20)} `;
});
p.innerText = ptext;

body.appendChild(p);

console.log("many Kinds of cheese");

const prom = new Promise((res) => console.log("promiseeeee", res));
console.log(prom);

class LookAClass {
    constructor(lemonade: string, bathTowel: Array<number>) {
        console.log(lemonade, bathTowel);
    }
}

const aClass = new LookAClass("banana flavored", [4, 3, 25, 4, 3]);
console.log(aClass);

// throw new Error("errorrororororor");
