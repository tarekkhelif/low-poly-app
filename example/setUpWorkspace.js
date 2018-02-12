// import "./node_modules/d3/dist/d3.js";
// import paper from "paper";
/* global d3: false, paper */

export function setUpWorkspace(workspace) {
    // Create SVG for D3
    const svg = d3
        .select(workspace)
        .append("svg")
        .attr("id", "svgProject");

    // Create canvas and associate it with `paper`
    const canvas = document.createElement("canvas");
    canvas.id = "canvasProject";
    // canvas.hidden = true;
    // workspace.appendChild(canvas);
    paper.setup(canvas);

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { svg });
    Object.assign(this.pjsProject, { view: paper.view });
    Object.assign(this.data, {});
}
