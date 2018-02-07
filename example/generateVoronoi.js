// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false */

export function generateVoronoi(svg, paper, sitesData, pjsRaster, pjsOutline) {
    // Get dimensions of SVG
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Calculate voronoi diagram
    const voronoi = d3.voronoi();
    voronoi.size([width, height]);
    const voronoiPolys = voronoi(sitesData).polygons();

    // Calculate the average color of each polygon
    const pjsPolys = [];

    const polygonData = voronoiPolys.map((polyCrds) => {
        const poly = new paper.Path({
            segments: polyCrds,
            closed: true
        });

        const trimmedPoly = poly.intersect(pjsOutline);

        pjsPolys.push(trimmedPoly);

        const color = pjsRaster.getAverageColor(trimmedPoly);
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

    return { svg, paper, polygonData };
}
