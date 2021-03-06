import * as d3 from "d3";
import { paper } from "paper";

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
    Object.assign(this.view, { document });
}
