// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

export async function getRaster() {
    // REAL // Get raster location from user
    // MOCK // Get raster location from example this.data
    const rasterPath = await this.exampleData.rasterPath;

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
    // MOCK // Set dimensions using this.exampleDatay
    const { width, height } = calcRasterScale(svgRaster, this.exampleData);
    // eslint-disable-next-line no-unused-vars
    function calcRasterScale(svgImageNode, exampleData) {
        // REAL // Do calculation
        // MOCK // Use example this.data for scaling
        const width = exampleData.width;
        const height = exampleData.height;

        return { width, height };
    }

    // Set dimensions of SVG and canvas to the same size as the raster
    this.d3Project.svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    this.pjsProject.view.viewSize = new paper.Size(width, height);

    // Append raster to SVG and set dimensions
    // (i.e. append the `svg:image` element created above to the SVG)
    this.d3Project.svg
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
    const maxBox = new paper.Rectangle(this.pjsProject.view.viewSize);
    if (!maxBox.contains(pjsRaster.size)) {
        pjsRaster.fitBounds(maxBox);
    }

    // Save useful stuff to project objects
    Object.assign(this.d3Project, {});
    Object.assign(this.pjsProject, { pjsRaster });
    Object.assign(this.data, {});
}
