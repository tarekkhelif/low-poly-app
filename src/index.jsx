/* @flow */
/* eslint-disable no-console */

import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

if (!document.body) {
    throw new Error("This documeny has no body 👀");
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

flowwwy("asdf", "sdffs");

const arr = [...Array(20)];

const p = document.createElement("p");

let ptext = "";
arr.forEach(() => {
    ptext += `${Math.floor(Math.random() * 20)} `;
});
p.innerText = ptext;

body.appendChild(p);

const prom = new Promise((res) => console.log("promiseeeee", res));
console.log(prom);
// throw new Error("errorrororororor");
