// import d3 from "./node_modules/d3/dist/d3.js";
// import paper from "./node_modules/paper/dist/paper-core.js";
/* global d3: false, paper */

import { setUpWorkspace } from "./example/setUpWorkspace.js";
import { getRaster } from "./example/getRaster.js";
import { outlineRaster } from "./example/outlineRaster.js";
import { generateSites } from "./example/generateSites.js";
import { generateVoronoi } from "./example/generateVoronoi.js";

app();
async function app() {
    // region // DEFINE EXAMPLE DATA
    const { exampleData } = defineExampleData();
    function defineExampleData() {
        // Define example data
        const exampleData = {
            rasterPath: "../nile.jpg",
            outlineFilePath:
                "../nw-outline.svg_outline_2018.02.02-23.21.10.csv",
            sitesFilePath:
                "../nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv",
            width: 906.54926,
            height: 604.36615
        };

        return { exampleData };
    }
    // endregion

    // region // SET UP BLANK WORKSPACE
    let svg;
    ({ svg, paper } = setUpWorkspace());
    // endregion

    // region // UI: GET RASTER
    let pjsRaster;
    ({ svg, paper, pjsRaster } = await getRaster(svg, paper, exampleData));
    // endregion

    // region // UI: OUTLINE RASTER
    let outlineData;
    ({ svg, paper, outlineData } = await outlineRaster(
        svg,
        paper,
        exampleData
    ));
    // endregion

    // region // GENERATE SITES FOR INITIAL VORONOI TESSELATION
    let sitesData;
    ({ svg, paper, randSites: sitesData } = generateSites(
        svg,
        paper,
        outlineData,
        100
    ));
    // endregion

    // region // UI: MOVE/ADD/DELETE SITES
    // endregion

    // region // PERFORM VORONOI TESSELATION AND COLOR BASED ON RASTER
    // endregion
    let voronoiPolys;
    ({ svg, paper, voronoiPolys } = generateVoronoi(
        svg,
        paper,
        sitesData,
        outlineData
    ));

    // region // UI: EDIT TESSELATION
    /* TODO
     * - move/add/delete vertices
     * - add/delete links
     * - default to recalculating color
     * - optionally lock color so it isn't recalculated
     * - choose custom color
    */
    // endregion

    // region // UI: DOWNLOAD SVG TO LOCAL MACHINE
    /* TODO
     * - download finished svg
    */
    // endregion
}
