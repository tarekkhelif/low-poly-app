// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

export function generateVoronoi() {
    // Get dimensions of SVG
    const width = +this.d3Project.svg.attr("width");
    const height = +this.d3Project.svg.attr("height");

    // D3 | Calculate Voronoi diagram
    const voronoi = d3.voronoi();
    voronoi.size([width, height]);
    const voronoiPolys = voronoi(this.data.sitesData).polygons();

    // Calculate the average color of each polygon
    const pjsPolys = []; // Save references to paperjs polys, for UI later
    // Save polygon this.data. Format is `{ pathString, color }`.
    const polygonData = voronoiPolys.map((polyCrds) => {
        // Create paperjs version of the polygon
        const poly = new paper.Path({
            segments: polyCrds,
            closed: true
        });

        // Paper.js | Cut off the parts of the polygon outside the outline
        const trimmedPoly = poly.intersect(this.pjsProject.pjsOutline);

        pjsPolys.push(trimmedPoly);

        // Paper.js | Calculate the average color of the part of the raster
        //              under the polygon
        const color = this.pjsProject.pjsRaster.getAverageColor(trimmedPoly);
        trimmedPoly.fillColor = color;
        trimmedPoly.strokeColor = color;

        return { pathData: trimmedPoly.pathData, color: color.toCSS() };
    });

    // Draw Voronoi tesselation in SVG
    const d3Polygons = this.d3Project.svg
        .append("g") // ................. Create a group for the polygons
        .attr("id", "polygons")
        .selectAll("*")
        .data(polygonData) // ........... Associate this.data with group's children
        .enter()
        .append("path") // .............. Add polygons to SVG
        .classed("polygon", true)
        .attr("d", (d) => d.pathData)
        .style("fill", (d) => d.color) // Color polygons with color from raster
        .style("stroke", (d) => d.color);

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Polygons });
    Object.assign(this.pjsProject, {});
    Object.assign(this.data, { polygonData });
}
