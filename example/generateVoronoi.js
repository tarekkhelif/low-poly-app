// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false */

export function generateVoronoi(svg, paper, sitesData, outlineData) {
    // Get dimensions of SVG
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Calculate voronoi diagram
    const voronoi = d3.voronoi();
    voronoi.size([width, height]);
    const voronoiPolys = voronoi(sitesData).polygons();

    // Draw Voronoi tesselation in SVG
    const d3Polygons = svg
        .append("g")
        .attr("id", "polygons")
        .selectAll("*")
        .data(voronoiPolys)
        .enter()
        .append("path")
        .classed("polygon", true)
        .attr("d", (d) => `M${d.join(",")}Z`);

    return { svg, paper, voronoiPolys };
}
