// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* eslint-disable no-use-before-define */
/* global d3: false, paper: false */

// UI for dragging a node
// eslint-disable-next-line func-names
const circleDragger = d3.drag().on("drag.node", function (d) {
    const selection = d3.select(this);

    // Update app-wide data
    d[0] += d3.event.dx;
    d[1] += d3.event.dy;

    // Change the location of the circle in the SVG
    selection.attr("cx", d[0]).attr("cy", d[1]);

    // Update polygons
    d3
        .selectAll(".polygon")
        .attr("d", (dat) => `M${dat.coordinates.join("L")}Z`)
        .style("fill", (dat) => dat.color) // Color polygons
        .style("stroke", (dat) => dat.color);
});

export function editTesselation() {
    this.d3Project.svg
        .append("g")
        .classed("graphNodes", true)
        .selectAll("*")
        .data(this.data.tesselationData.nodes)
        .enter()
        .append("circle")
        .classed("node", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .call(circleDragger);
}
