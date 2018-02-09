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
    const diagram = voronoi(this.data.sitesData);
    const voronoiPolys = diagram.polygons();

    // Calculate the average color of each polygon
    const polygonData = []; // Save data. Format is `{ coordinates, color }`.
    const pjsPolys = []; // Save references to paperjs polys, for UI later
    voronoiPolys.forEach((polyCrds) => {
        // Create paperjs version of the Voronoi polygon
        const voronoiPoly = new paper.Path({
            segments: polyCrds,
            closed: true
        });

        // Paper.js | Cut off parts of Voronoi polygon outside the outline
        const trimmedPoly = voronoiPoly.intersect(this.pjsProject.pjsOutline);

        // Make a separate path for each subpath in compound paths
        const subPaths =
            trimmedPoly instanceof paper.Path
                ? [trimmedPoly]
                : trimmedPoly.children.map((child) =>
                    new paper.Path({
                        segments: child.segments,
                        closed: true
                    }));

        // Calculate color and save data of each sub-path
        subPaths.forEach((polygon) => {
            // Paper.js | Calculate the average color of the part of the raster
            //   under the polygon
            const color = this.pjsProject.pjsRaster
                .getAverageColor(polygon)
                .toCSS();
            polygon.fillColor = color;
            polygon.strokeColor = color;

            // Save paperjs polygons for later
            pjsPolys.push(polygon);

            // Save data for later
            polygonData.push({
                coordinates: polygon.segments.map((seg) => [
                    seg.point.x,
                    seg.point.y
                ]),
                color
            });
        });
    });

    // Draw Voronoi tesselation in SVG
    const d3Polygons = this.d3Project.svg
        .append("g") // ................. Create a group for the polygons
        .attr("id", "polygons")
        .selectAll("*")
        .data(polygonData) // ........... Associate data with group's children
        .enter()
        .append("path") // .............. Add polygons to SVG
        .classed("polygon", true)
        .attr("d", (d) => `M${d.coordinates.join("L")}Z`)
        .style("fill", (d) => d.color) // Color polygons with color from raster
        .style("stroke", (d) => d.color);

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Polygons });
    Object.assign(this.pjsProject, {});
    Object.assign(this.data, { polygonData });
}
