// import SVG from "svg.js";
/* global SVG: false */

// Confirm that the "imports" are working
// eslint-disable-next-line no-console
console.log(SVG);

// Use svg.js within the element with id `#drawing`
const drawing = SVG("drawing").size(300, 300);

// // Draw some things
// const rect = drawing.rect(100, 100).attr({ fill: "#dd6" });
// drawing
//     .rect(100, 100)
//     .animate()
//     .fill("#f03")
//     .move(100, 100);

const bkgd = drawing.rect(300, 300).fill("#00000000");
bkgd.on("mousedown", placeDot);

function placeDot(e) {
    const marker = drawing
        .circle(10)
        .fill("#69f")
        .stroke("#339")
        .center(e.offsetX, e.offsetY);

    marker.on("mousedown", (e) => {
        marker.fill("#c22").stroke("#f00");
    });
}
