/**
 * @file Runs an example/prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */

// import d3 from "./node_modules/d3/dist/d3.js";
// import paper from "./node_modules/paper/dist/paper-core.js";

import { setUpWorkspace as $setUpWorkspace } from "./example/setUpWorkspace.js";
import { getRaster as $getRaster } from "./example/getRaster.js";
import { outlineRaster as $outlineRaster } from "./example/outlineRaster.js";
import { generateSites as $generateSites } from "./example/generateSites.js";
import { generateVoronoi as $generateVoronoi } from "./example/generateVoronoi.js";

class LowPolyProject {
    constructor() {
        // Initialize containers for usefull information, categorized by whether
        //   they're the generic data that defines the project, or specific
        //   pieces of either the D3 or Paper.js rendering of the project.
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

    async run() {
        this.setUpWorkspace();
        await this.getRaster();
        await this.outlineRaster();
        this.generateSites(100);
        this.generateVoronoi();
    }

    // Set up blank workspace
    setUpWorkspace() {
        $setUpWorkspace(
            this.d3Project,
            this.pjsProject,
            this.data,
            this.exampleData
        );
    }

    // UI: Get raster
    async getRaster() {
        await $getRaster(
            this.d3Project,
            this.pjsProject,
            this.data,
            this.exampleData
        );
    }

    // UI: Outline raster
    async outlineRaster() {
        await $outlineRaster(
            this.d3Project,
            this.pjsProject,
            this.data,
            this.exampleData
        );
    }

    // Generate sites for initial Voronoi tesselation
    generateSites(n) {
        $generateSites(
            this.d3Project,
            this.pjsProject,
            this.data,
            this.exampleData,
            n
        );
    }

    // UI: Move/add/delete sites

    // Perform Voronoi tesselation and color based on raster
    generateVoronoi() {
        $generateVoronoi(
            this.d3Project,
            this.pjsProject,
            this.data,
            this.exampleData
        );
    }

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

const project = new LowPolyProject();
project.run();
