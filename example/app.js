/**
 * @file Implementation of a prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */

import { setUpWorkspace } from "./setUpWorkspace.js";
import { getRaster } from "./getRaster.js";
import { outlineRaster } from "./outlineRaster.js";
import { generateSites } from "./generateSites.js";
import { generateVoronoi } from "./generateVoronoi.js";
import { editTesselation } from "./editTesselation.js";

export class LowPolyProject {
    // Initialize holders for data
    constructor() {
        // Initialize data bags for the fundamental data of the project, stuff
        //   rendered with D3, stuff rendered with Paper.js, and example data.
        this.d3Project = {};
        this.pjsProject = {};
        this.data = {};

        // Define example data
        this.exampleData = {
            rasterPath: "../nile.jpg",
            outlineFilePath:
                "../nw-outline.svg_outline_2018.02.02-23.21.10.csv",
            sitesFilePath:
                "../nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv",
            width: 906.54926,
            height: 604.36615
        };
    }

    // Run app
    async run() {
        // Set up blank workspace
        this.setUpWorkspace();

        // UI: Get raster
        await this.getRaster();

        // UI: Outline raster
        await this.outlineRaster();

        // Generate sites for initial Voronoi tesselation
        this.generateSites(100);

        // Perform Voronoi tesselation and color based on raster
        this.generateVoronoi();

        /* UI: Edit tesselation
         * TODO:
         * - move/add/delete vertices
         * - add/delete links
         * - default to recalculating color
         * - optionally lock color so it isn't recalculated
         * - choose custom color
         */
        this.editTesselation();

        /* UI: Download svg to local machine
         * TODO:
         * - download finished svg
         */
    }
}

// Assign the methods that are imported other files
// Each of these functions represents one phase of the app
Object.assign(LowPolyProject.prototype, {
    setUpWorkspace,
    getRaster,
    outlineRaster,
    generateSites,
    generateVoronoi,
    editTesselation
});
