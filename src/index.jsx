/* @flow */

import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

if (!document.body) {
    throw new Error("This document has no body 👀");
}

const body: HTMLElement = document.body;

const myDiv = document.createElement("div");
body.appendChild(myDiv);

ReactDOM.render(<h1>Hello World!</h1>, myDiv);
