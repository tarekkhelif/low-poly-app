// import d3 from "D3";
// import paper from "paper";
/* global d3: false, paper: false */

// Define example data
const rasterPath = "./nile.jpg";
const outlineFilePath = "./nw-outline.svg_outline_2018.02.02-23.21.10.csv";
const sitesFilePath =
    "./nw-outline.svg_points-inside_100_2018.02.02-23.21.38.csv";
const width = 906.54926;
const height = 604.36615;

// Create SVG for D3
const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create canvas and associate it with `Paper`
const canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);
paper.setup(canvas);
paper.view.viewSize = new paper.Size(width, height);

// Put raster in D3 SVG
svg
    .append("image")
    .attr("xlink:href", rasterPath)
    .attr("width", width)
    .attr("height", height);

// Create paper.js raster
const pjsRaster = new paper.Raster(rasterPath);

// Wait for raster to load
pjsRaster.on("load", () => {
    // Scale raster
    const maxBox = new paper.Rectangle(paper.view.viewSize);
    if (!maxBox.contains(pjsRaster.size)) {
        pjsRaster.fitBounds(maxBox);
    }

    dealWithSites();
});

// Get sites from file
function dealWithSites() {
    d3.text(sitesFilePath, (text) => {
        // Parse data, cast to array of numbers
        const sitesData = d3
            .csvParseRows(text)
            .map((row) => row.map((value) => +value));

        const polygons = displayVoronoi(sitesData);
        dealWithOutline(polygons);
    });
}

// Get outline coords from file
function dealWithOutline(polygons) {
    d3.text(outlineFilePath, (text) => {
        // Parse data, cast to array of numbers
        const outlinePts = d3
            .csvParseRows(text)
            .map((row) => row.map((value) => +value));

        // Make paper.js version of outline
        const pjsOutline = new paper.Path({
            segments: outlinePts,
            closed: true
        });

        trimPolygons(pjsOutline, polygons);
    });
}

// Create interactive Voronoi diagram based on `sites`
function displayVoronoi(sites) {
    const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);

    const polygons = svg
        .append("g")
        .attr("class", "polygons")
        .selectAll("path")
        .data(voronoi.polygons(sites))
        .enter()
        .append("path")
        .call(redrawPolygon);

    function redrawPolygon(polygon) {
        polygon.attr("d", (d) => (d ? `M${d.join("L")}Z` : null));
    }

    return polygons;
}

function trimPolygons(pjsOutline, polygons) {
    // Trim polygons
    polygons
        .datum((d) => {
            // Make paper.js version of each polygon
            const pjsPolygon = new paper.Path({
                segments: d,
                closed: true
            });

            // Trim parts of polygon that are outside the outline
            const pjsTrimmedPoly = pjsPolygon.intersect(pjsOutline);
            const avgColor = pjsRaster.getAverageColor(pjsTrimmedPoly);
            pjsTrimmedPoly.fillColor = avgColor;

            // Store stuff calculated with paper.js as D3 data on each element
            const fruitsOfPjs = {
                data: pjsTrimmedPoly.pathData,
                color: pjsTrimmedPoly.fillColor.toCSS(true)
            };
            return fruitsOfPjs;
        })
        .attr("d", (d) => d.data)
        .style("fill", (d) => d.color)
        .style("stroke", (d) => d.color);
}
