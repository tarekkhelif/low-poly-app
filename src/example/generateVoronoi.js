import * as d3 from "d3";
import { paper } from "paper";

import { addIfUnique, pairs } from "./util/arrayTools.js";

export function generateVoronoi() {
    // Get dimensions of SVG
    const width = +this.d3Project.svg.attr("width");
    const height = +this.d3Project.svg.attr("height");

    // D3 | Calculate Voronoi diagram
    const voronoi = d3.voronoi();
    voronoi.size([width, height]);
    const diagram = voronoi(this.data.sitesData);
    const voronoiPolys = diagram.polygons();

    // Holds graph and polygon data
    const tesselationData = {
        polygons: [],
        nodes: [],
        edges: []
    };

    // Holds paperjs polygons, for UI later
    const pjsPolys = [];

    // Construct tesselation of outline with Voronoi diagram as a starting point
    voronoiPolys.forEach((voronoiPolyCoords) => {
        // Create paperjs version of the Voronoi polygon
        const pjsVoronoiPoly = new paper.Path({
            segments: voronoiPolyCoords,
            closed: true
        });

        // Paper.js | Cut off parts of Voronoi polygon outside the outline
        const trimmed = pjsVoronoiPoly.intersect(this.pjsProject.pjsOutline);

        // Make a separate path for each subpath in compound paths
        const subPaths =
            trimmed instanceof paper.Path
                ? [trimmed]
                : trimmed.children.map((child) =>
                    new paper.Path({
                        segments: child.segments,
                        closed: true
                    }));

        // Calculate color and save polygon data
        /* Each point is represented by a single array object.  When a point
             appears in two (or more) polygons, the *same* object is used to
             represent the point in both polygons.  This way, when a point is
             moved by the user, everything that uses that point knows about the
             change and can be re-rendered accordingly */
        subPaths.forEach((pjsPoly) => {
            // CALCULATE COLOR
            /* Paper.js | Calculate average color of raster under polygon */
            let color = this.pjsProject.pjsRaster.getAverageColor(pjsPoly);

            /* Exclude problematic polygons
                 If the cut polygon is skinny or weird in some other way and
                 paperjs can't get a color from the raster, then log the error
                 and skip to the next polygon */
            try {
                color = color.toCSS();
            } catch (error) {
                /* eslint-disable no-console */
                console.log(color, pjsPoly);
                console.log(error);
                /* eslint-enable no-console */
                return;
            }

            // Color the paperjs polygons
            pjsPoly.fillColor = color;
            pjsPoly.strokeColor = color;

            // Save paperjs polygons for later
            pjsPolys.push(pjsPoly);

            // CONSTRUCT NEW DATA ENTRY
            /* Use unique points for `polyCoords`
                 When polygons share a vertex, use the same `Array` object in
                 both polygon arrrays.  This way when a point is updated, all
                 polygons that include that point are updated. */
            const polyCoords = pjsPoly.segments.map((seg) => {
                /* The unique object for `point`
                     An array object with the same coordinates as `point`.
                     Possibly `point` itself, possible a pre-existing version
                     from `tesselationData.nodes` */
                const uniqueNode = addIfUnique(
                    [seg.point.x, seg.point.y],
                    tesselationData.nodes
                );

                return uniqueNode;
            });

            // Use unique edges for `polyEdges`
            const polyEdges = pairs(polyCoords).map((edge) => {
                const uniqueEdge = addIfUnique(edge, tesselationData.edges);
                return uniqueEdge;
            });

            // Save polygon to app-wide data object
            const polygon = {
                coordinates: polyCoords,
                edges: polyEdges,
                color
            };
            tesselationData.polygons.push(polygon);
        });
    });

    // Draw Voronoi tesselation in SVG
    const d3Polygons = this.d3Project.svg
        .append("g") // .................. Create a group for the polygons
        .attr("id", "polygons")
        .selectAll("*")
        .data(tesselationData.polygons) // Associate data with group's children
        .enter()
        .append("path") // ............... Add polygons to SVG
        .classed("polygon", true)
        .attr("d", (d) => `M${d.coordinates.join("L")}Z`)
        .style("fill", (d) => d.color) //  Color polygons with color from raster
        .style("stroke", (d) => d.color);

    // Hide sites
    d3.select("#sites").attr("visibility", "hidden");

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Polygons });
    Object.assign(this.pjsProject, {});
    Object.assign(this.data, { tesselationData });
}
