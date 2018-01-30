// import SVG from "svg.js";
/* global SVG: false */

// Confirm that the "imports" are working
// eslint-disable-next-line no-console
console.log(SVG);

// Create containing HTML element
const container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);

const drawing = SVG(container).size(300, 300);
const rect = drawing.rect(100, 100).attr({ fill: "#dd6" });
