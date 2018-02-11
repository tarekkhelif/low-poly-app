// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

import { randPtInPoly } from "./util/geometry.js";

export function generateSites(n) {
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
