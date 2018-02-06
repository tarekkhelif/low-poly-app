// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false */

import { randPtInPoly } from "./util/geometry.js";

export function generateSites(svg, paper, outlineData, n) {
    // Generate `n` random points
    const randSites = d3.range(n).map(() => randPtInPoly(outlineData));

    // Add the points to the svg
    const sites = svg
        .append("g")
        .attr("id", "sites")
        .selectAll("*")
        .data(randSites)
        .enter()
        .append("circle")
        .classed("site", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    return { svg, paper, sites };
}
