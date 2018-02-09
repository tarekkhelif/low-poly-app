// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* eslint-disable no-use-before-define */
/* global d3: false, paper: false */

function myPolygon(datum) {
    const coords = datum.coordinates;

    d3
        .select(this)
        .append("g")
        .classed("myThings", true)
        // .append("path")
        // .classed("myPolygon")
        // .attr("d", (d) => `M${d.join("L")}Z`)
        .selectAll("*")
        .data(coords)
        .enter()
        .append("circle")
        .classed("polyNode", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .call(dragger);
}

// UI for dragging an element
// eslint-disable-next-line func-names
const dragger = d3.drag().on("drag", function (d) {
    if (d.translation === undefined) {
        d.translation = { x: 0, y: 0 };
    }
    d.translation.x += d3.event.dx;
    d.translation.y += d3.event.dy;
    d3
        .select(this)
        .attr("transform", `translate(${d.translation.x}, ${d.translation.y})`);
});
export function editTesselation() {
    // const polygons = this.d3Project.d3Polygons;

    this.d3Project.svg
        .append("g")
        .classed("myPolygons", true)
        .selectAll("*")
        .data(this.data.polygonData)
        .enter()
        .each(myPolygon);
    // .classed("myPolygon", true);
    // .selectAll("*")
    // .append("circle")
    // .append("path")
    // .attr("d", (d) => `M${d.coordinates.join("L")}Z`);
}
