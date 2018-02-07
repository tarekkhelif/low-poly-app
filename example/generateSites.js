// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

import { randPtInPoly } from "./util/geometry.js";

export function generateSites(d3Project, pjsProject, data, exampleData, n) {
    const { svg } = d3Project;

    // Generate `n` random points
    const randSites = d3.range(n).map(() => randPtInPoly(data.outlineData));

    // Add the points to the svg
    const d3Sites = svg
        .append("g")
        .attr("id", "sites")
        .selectAll("*")
        .data(randSites)
        .enter()
        .append("circle")
        .classed("site", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Add the points to paper.js canvas
    const pjsSites = randSites.map((site) =>
        new paper.Path.Circle({
            center: new paper.Point(site),
            radius: 10,
            fillColor: new paper.Color("rgba(198, 81, 81, 0.404)")
        }));

    Object.assign(d3Project, {});
    Object.assign(pjsProject, {});
    Object.assign(data, { sitesData: randSites });
}
