// import SVG from "svg.js";
/* global SVG: false */

// Confirm that the "imports" are working
// eslint-disable-next-line no-console
console.log(SVG);

// Use svg.js within the element with id `#drawing`
const drawing = SVG("drawing").size(300, 300);

// Draw some things
const rect = drawing.rect(100, 100).attr({ fill: "#dd6" });
drawing
    .rect(100, 100)
    .animate()
    .fill("#f03")
    .move(100, 100);
