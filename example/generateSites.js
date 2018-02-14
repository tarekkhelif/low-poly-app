// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

import { randPtInPoly } from "./util/geometry.js";
import { IncrementalId } from "./util/id.js";

// API functions
function addSites(...newPoints) {
    this.data.sitesData.push(...newPoints);
}
function moveSite(existingPoint, delta) {
    const newPoint = [existingPoint[0] + delta[0], existingPoint[1] + delta[1]];
    if (d3.polygonContains(this.data.outlineData, newPoint)) {
        existingPoint[0] = newPoint[0];
        existingPoint[1] = newPoint[1];
    }
}
function deleteSites(...existingPoints) {
    existingPoints.forEach((existingPoint) =>
        this.data.sitesData.splice(
            this.data.sitesData.indexOf(existingPoint),
            1
        ));
}
function addRandSites(n) {
    const randSites = Array.from(Array(n)).map(() =>
        randPtInPoly(this.data.outlineData));
    addSites.call(this, ...randSites);
}

// UI functions that use the API
function addSiteUI() {
    /* In d3 event handlers, `this` is set to the current DOM element, so we'll
         hold the outer `this`, which points to the app's data, in a new
         variable `self` */
    const self = this;

    self.d3Project.d3Outline
        // Listen for clicks in outline fill area (even though it isn't filled)
        .attr("pointer-events", "fill")
        // eslint-disable-next-line func-names
        .on("mousedown.addSite", function () {
            addSites.call(self, d3.mouse(this));
            updateSitesRender.call(self);
        });
}
function moveSiteUI() {
    const self = this;
    // eslint-disable-next-line func-names
    const dragged = d3.drag().on("drag.moveSite", function (d) {
        if (d3.polygonContains(self.data.outlineData, d3.mouse(this))) {
            moveSite.call(self, d, [d3.event.dx, d3.event.dy]);
            updateSitesRender.call(self);
        }
    });

    // TODO: End drag gesture when pointer leaves outline
    return dragged;
}
function deleteSiteUI(selection) {
    const self = this;

    // eslint-disable-next-line func-names
    selection.on("mousedown", (d) => {
        if (d3.event.ctrlKey) {
            deleteSites.call(self, d);
            updateSitesRender.call(this);
        }
    });
}
function addRandSitesUI() {
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
        addRandSites.call(this, +numPickerInput.value);
        updateSitesRender.call(this);
    });
    numPicker.appendChild(numPickerButton);
}

// Update renderings
function updateSitesRender() {
    d3UpdateSites.call(this);
    pjsUpdateSites.call(this);
}
function d3UpdateSites() {
    // Add new data to the selection
    const existing = this.d3Project.svg
        .select(".sites")
        .selectAll("*")
        .data(this.data.sitesData, (d) => d.id);

    // Create new elements and update old elements, if necessary
    existing
        .enter() // .................. Select entering elements
        .append("circle") // ......... Add new sites to SVG
        .classed("site", true)
        .attr("id", (d) => d.id)
        .call(moveSiteUI.call(this))
        .call(deleteSiteUI.bind(this))
        .merge(existing) // .......... Act on existing and new sites
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Remove excess elements
    existing.exit().remove();
}
function pjsUpdateSites() {
    // eslint-disable-next-line no-console
    console.log("pjsUpdateSites is not implemented yet.");

    // Add the sites to paper.js canvas
    // this.pjsProject.pjsSites.push(...newSites.map((site) =>
    //     new paper.Path.Circle({
    //         center: new paper.Point(site),
    //         radius: 10,
    //         fillColor: new paper.Color("rgba(198, 81, 81, 0.404)")
    //     })));
}

function setUpGenerateSitesUI() {
    addSiteUI.call(this);
    // Implement differently so this works | moveSiteUI.call(this);
    // Implement differently so this works | deleteSiteUI.call(this);
    addRandSitesUI.call(this);
}

export function chooseSites() {
    // Initialize sites data holders
    // Create id generator object
    // eslint-disable-next-line no-underscore-dangle
    const _sitesData = [];
    _sitesData.idGenerator = new IncrementalId("site");
    const sitesData = new Proxy(_sitesData, {
        set(target, key, value) {
            if (!Number.isNaN(Number(key)) && key !== "" && !value.id) {
                value.id = target.idGenerator.newId();
            }
            target[key] = value;
            return true;
        }
    });
    this.d3Project.svg.append("g").classed("sites", true);
    const pjsSites = new Set();

    // Set up controls for this phase
    setUpGenerateSitesUI.call(this);

    // Save useful stuff to project objects
    Object.assign(this.d3Project, {});
    Object.assign(this.pjsProject, { pjsSites });
    Object.assign(this.data, { sitesData });
}

export function exampleSites(n) {
    // Generate `n` random points
    const randSites = d3
        .range(n)
        .map(() => randPtInPoly(this.data.outlineData));

    // Add the points to the svg
    const d3Sites = this.d3Project.svg
        .append("g") // ............. Create group for sites (seed points for
        .attr("id", "sites") // .....   Voronoi diagram)
        .selectAll("*")
        .data(randSites) // ......... Associate this.data with group's children
        .enter()
        .append("circle") // ........ Add sites to SVG
        .classed("site", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Add the sites to paper.js canvas
    const pjsSites = randSites.map((site) =>
        new paper.Path.Circle({
            center: new paper.Point(site),
            radius: 10,
            fillColor: new paper.Color("rgba(198, 81, 81, 0.404)")
        }));

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Sites });
    Object.assign(this.pjsProject, { pjsSites });
    Object.assign(this.data, { sitesData: randSites });
}
