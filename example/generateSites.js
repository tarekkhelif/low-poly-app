// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

import { randPtInPoly } from "./util/geometry.js";

function generateSitesUI() {
    // numPicker div
    const numPicker = document.createElement("div");
    numPicker.id = "numPicker";
    document.getElementById("stageTools").appendChild(numPicker);

    // UI input for number of sites
    const numPickerInput = document.createElement("input");
    numPickerInput.type = "number";
    numPickerInput.min = 1;
    numPickerInput.max = 100;
    numPickerInput.value = 25;
    numPickerInput.required = true;
    numPicker.appendChild(numPickerInput);

    // Button to generate sites
    const numPickerButton = document.createElement("button");
    numPickerButton.id = "numPickerButton";
    numPickerButton.innerHTML = "➡";
    // Generate `n` random points onclick
    numPickerButton.addEventListener("click", () => {
        const randSites = Array.from(Array(+numPickerInput.value)).map(() =>
            randPtInPoly(this.data.outlineData));
        renderSites.call(this, randSites);
    });
    numPicker.appendChild(numPickerButton);
}

function renderSites(newSites) {
    // Add new sites to global list of sites
    this.data.sitesData.push(...newSites);

    // Add the points to the svg
    this.d3Project.d3Sites
        .data(newSites) // ......... Associate this.data with group's children
        .enter()
        .append("circle") // ........ Add sites to SVG
        .classed("site", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Add the sites to paper.js canvas
    this.pjsProject.pjsSites.push(...newSites.map((site) =>
        new paper.Path.Circle({
            center: new paper.Point(site),
            radius: 10,
            fillColor: new paper.Color("rgba(198, 81, 81, 0.404)")
        })));
}

export function generateSites() {
    // Set up controls for this phase
    generateSitesUI.bind(this)();

    // Initialize global list of sites
    const sitesData = [];

    // Create group for sites
    const d3Sites = this.d3Project.svg
        .append("g") // ............. Create group for sites (seed points for
        .attr("id", "sites") // .....   Voronoi diagram)
        .selectAll("*");

    // Initialize list of pjsSites
    const pjsSites = [];

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Sites });
    Object.assign(this.pjsProject, { pjsSites });
    Object.assign(this.data, { sitesData });
}
