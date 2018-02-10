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
        .call(circleDragger);
}

// UI for dragging an element
// eslint-disable-next-line func-names
const circleDragger = d3.drag().on("drag", function (d) {
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
        .attr("asdfasdf", true)
        .style("fill", (dat) => dat.color) // Color polygons with color from raster
        .style("stroke", (dat) => dat.color);
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
