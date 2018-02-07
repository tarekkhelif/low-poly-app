/**
 * @file Runs an example/prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */

// import d3 from "./node_modules/d3/dist/d3.js";
// import paper from "./node_modules/paper/dist/paper-core.js";

import { setUpWorkspace } from "./example/setUpWorkspace.js";
import { getRaster } from "./example/getRaster.js";
import { outlineRaster } from "./example/outlineRaster.js";
import { generateSites } from "./example/generateSites.js";
import { generateVoronoi } from "./example/generateVoronoi.js";

app();
async function app() {
    // Initialize containers for usefull information, categorized by whether
    //   they're the generic data that defines the project, or specific pieces
    //   of either the D3 or Paper.js rendering of the project
    const d3Project = {};
    const pjsProject = {};
    const data = {};

    // Define example data
    const exampleData = {
        rasterPath: "../nile.jpg",
        outlineFilePath: "../nw-outline.svg_outline_2018.02.02-23.21.10.csv",
        sitesFilePath:
            "../nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv",
        width: 906.54926,
        height: 604.36615
    };

    // Set up blank workspace
    setUpWorkspace(d3Project, pjsProject, data, exampleData);

    // UI: Get raster
    await getRaster(d3Project, pjsProject, data, exampleData);

    // UI: Outline raster
    await outlineRaster(d3Project, pjsProject, data, exampleData);

    // Generate sites for initial Voronoi tesselation
    generateSites(d3Project, pjsProject, data, exampleData, 100);

    // UI: Move/add/delete sites

    // Perform Voronoi tesselation and color based on raster
    generateVoronoi(d3Project, pjsProject, data, exampleData);

    // UI: Edit tesselation
    /* TODO
     * - move/add/delete vertices
     * - add/delete links
     * - default to recalculating color
     * - optionally lock color so it isn't recalculated
     * - choose custom color
    */

    // UI: Download svg to local machine
    /* TODO
     * - download finished svg
    */
}
