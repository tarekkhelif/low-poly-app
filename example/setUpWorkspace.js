// import "./node_modules/d3/dist/d3.js";
// import paper from "paper";
/* global d3: false, paper */

export function setUpWorkspace(d3Project, pjsProject, data, exampleData) {
    // Create SVG for D3
    const svg = d3.select("body").append("svg");

    // Create canvas and associate it with `Paper`
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);
    paper.setup(canvas);

    Object.assign(d3Project, { svg });
    Object.assign(pjsProject, { view: paper.view });
    Object.assign(data, {});
}
