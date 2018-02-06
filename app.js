/* eslint-disable prefer-destructuring, no-global-assign, no-param-reassign */
// import "./node_modules/d3/build/d3.js";
// import paper from "paper";
/* global d3: false, paper */

app();
async function app() {
    // region // DEFINE EXAMPLE DATA
    const { exampleData } = defineExampleData();
    function defineExampleData() {
        // Define example data
        const exampleData = {
            rasterPath: "./nile.jpg",
            outlineFilePath: "./nw-outline.svg_outline_2018.02.02-23.21.10.csv",
            sitesFilePath:
                "./nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv",
            width: 906.54926,
            height: 604.36615
        };

        return { exampleData };
    }
    // endregion

    // region // SET UP BLANK WORKSPACE
    let svg;
    ({ svg, paper } = setUpWorkspace());
    function setUpWorkspace() {
        // Create SVG for D3
        const svg = d3.select("body").append("svg");

        // Create canvas and associate it with `Paper`
        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);
        paper.setup(canvas);

        return { svg, paper };
    }
    // endregion

    // region // UI: LOAD RASTER
    ({ svg, paper } = await loadRaster(svg, paper));
    async function loadRaster(svg, paper) {
        // REAL // Get raster location from user
        const rasterPath = await exampleData.rasterPath;

        // Load the raster in an `svg:image` element
        const svgRaster = await new Promise((resolve, reject) => {
            d3
                .create("svg:image")
                .attr("href", rasterPath)
                // eslint-disable-next-line func-names
                .attr("onload", function () {
                    resolve(this);
                })
                .attr("onerror", () =>
                    reject(new Error(`D3 failed to load the image at 
                        ${rasterPath}`)));
        });

        // REAL // Calculate appropriate scaling
        const { width, height } = calcRasterScale(svgRaster);
        // eslint-disable-next-line no-unused-vars
        function calcRasterScale(svgImageNode) {
            // REAL // Do calculation
            // MOCK // Use example data for scaling
            const width = exampleData.width;
            const height = exampleData.height;

            return { width, height };
        }

        // Set dimensions of SVG and canvas to the same size as the raster
        svg.attr("width", width).attr("height", height);
        paper.view.viewSize = new paper.Size(width, height);

        // Append raster to SVG and set dimensions
        // (i.e. append the `svg:image` element created above to the SVG)
        svg
            .append(() => svgRaster)
            .attr("width", width)
            .attr("height", height);

        // Create Paper.js raster.
        const pjsRaster = await new Promise((resolve, reject) => {
            const raster = new paper.Raster(rasterPath);
            raster.onLoad = () => resolve(raster);
            raster.onError = () =>
                reject(new Error(`Paper.js failed to load the image at 
                    ${rasterPath}`));
        });
        // Set dimensions of Paper.js raster
        const maxBox = new paper.Rectangle(paper.view.viewSize);
        if (!maxBox.contains(pjsRaster.size)) {
            pjsRaster.fitBounds(maxBox);
        }

        return { svg, paper };
    }
    // endregion

    // region // UI: OUTLINE RASTER
    ({ svg, paper } = await outlineRaster(svg, paper));
    async function outlineRaster(svg, paper) {
        return { svg, paper };
    }
    // endregion

    // region // GENERATE SITES FOR INITIAL VORONOI TESSELATION
    // endregion

    // region // UI: MOVE/ADD/DELETE SITES
    // endregion

    // region // PERFORM VORONOI TESSELATION AND COLOR BASED ON RASTER
    // endregion

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
