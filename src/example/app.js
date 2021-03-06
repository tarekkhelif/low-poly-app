/**
 * @file Implementation of a prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */
/* TODO:
 * (1)
 * - Export image
 * - Enable drawing outline
 * (2)
 * - (?) Restrict moving nodes to be within a bounding polygon
 * - Enable ability to upload a raster
 * (3)
 * - Enable ability to add/delete nodes and edges
 * (4)
 * - Catch up on pjs version
 */

import { createStore } from "redux";

import { appReducer } from "./store/reducer";

import { setUpUI } from "./setUpUI.js";
import { setUpWorkspace } from "./setUpWorkspace.js";
import { getRaster } from "./getRaster.js";
import { outlineRaster } from "./outlineRaster.jsx";
import { chooseSites } from "./generateSites.jsx";
import { generateVoronoi } from "./generateVoronoi.js";
import { editTesselation } from "./editTesselation.jsx";
import { exportArt } from "./exportArt";

import rasterPath from "./example-data/nile.jpg";
import outlineExampleData from
    "./example-data/nw-outline.svg_outline_2018.02.02-23.21.10.csv";
import sitesFilePath from
    "./example-data/nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv";

export class LowPolyProject {
    // Initialize holders for data
    constructor() {
        // Initialize data bags for the fundamental data of the project, stuff
        //   rendered with D3, stuff rendered with Paper.js, the html document,
        //   and example data.
        this.d3Project = {};
        this.pjsProject = {};
        this.data = {};
        this.view = {};

        // Define example data
        this.exampleData = {
            rasterPath,
            outlineExampleData,
            sitesFilePath,
            width: 906.54926,
            height: 604.36615
        };

        this.store = createStore(appReducer);
    }
}

// Assign the methods that are imported other files
// Each of these functions represents one phase of the app
Object.assign(LowPolyProject.prototype, {
    setUpUI,
    setUpWorkspace,
    getRaster,
    outlineRaster,
    chooseSites,
    generateVoronoi,
    editTesselation,
    exportArt
});
