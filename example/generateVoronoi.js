// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

export function generateVoronoi(d3Project, pjsProject, data, exampleData) {
    const { svg } = d3Project;

    // Get dimensions of SVG
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Calculate voronoi diagram
    const voronoi = d3.voronoi();
    voronoi.size([width, height]);
    const voronoiPolys = voronoi(data.sitesData).polygons();

    // Calculate the average color of each polygon
    const pjsPolys = [];

    const polygonData = voronoiPolys.map((polyCrds) => {
        const poly = new paper.Path({
            segments: polyCrds,
            closed: true
        });

        const trimmedPoly = poly.intersect(pjsProject.pjsOutline);

        pjsPolys.push(trimmedPoly);

        const color = pjsProject.pjsRaster.getAverageColor(trimmedPoly);
        trimmedPoly.fillColor = color;
        trimmedPoly.strokeColor = color;

        return { pathData: trimmedPoly.pathData, color: color.toCSS() };
    });

    // Draw Voronoi tesselation in SVG
    const d3Polygons = svg
        .append("g")
        .attr("id", "polygons")
        .selectAll("*")
        .data(polygonData)
        .enter()
        .append("path")
        .classed("polygon", true)
        .attr("d", (d) => d.pathData)
        .style("fill", (d) => d.color)
        .style("stroke", (d) => d.color);

    Object.assign(d3Project, {});
    Object.assign(pjsProject, {});
    Object.assign(data, { polygonData });
}
