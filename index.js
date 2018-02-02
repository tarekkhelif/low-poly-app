/* eslint-disable no-param-reassign */
// import d3 from "d3";
// import paper from "paper";
/* global d3: false, paper: false */
// const Paper = paper;

// Get references from DOM
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Create canvas and associate it with `Paper`
/* (Don't add canvas to DOM, since it's only used for calculating stuff with
 * paper.js)
 */
const canvas = document.createElement("canvas");
canvas.id = "canvas";
paper.setup(canvas);

const outlineFilePath = "./nw_outline.svg_outline_2018.01.08-19.18.50.csv";
const sitesFilePath =
    "nw_outline.svg_points-inside_100_2018.01.08-19.19.31.csv";

// Get sites from file
d3.text(sitesFilePath, (text) => {
    // Parse data, cast to array of numbers
    const data = d3.csvParseRows(text).map((row) => row.map((value) => +value));

    displayTheStuff(data);
    drawOutline();
});

// Get outline coords from file
function drawOutline() {
    d3.text(outlineFilePath, (text) => {
        const data = d3
            .csvParseRows(text)
            .map((row) => row.map((value) => +value));

        displayPoly(data);
    });
}

// Create interactive Voronoi diagram based on `sites`
function displayTheStuff(sites) {
    svg.on("touchmove mousemove", moved);

    const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);

    let polygon = svg
        .append("g")
        .attr("class", "polygons")
        .selectAll("path")
        .data(voronoi.polygons(sites))
        .enter()
        .append("path")
        .call(redrawPolygon);

    let link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(voronoi.links(sites))
        .enter()
        .append("line")
        .call(redrawLink);

    let site = svg
        .append("g")
        .attr("class", "sites")
        .selectAll("circle")
        .data(sites)
        .enter()
        .append("circle")
        .attr("r", 2.5)
        .call(redrawSite);

    function moved() {
        sites[0] = d3.mouse(this);
        redraw();
    }

    function redraw() {
        const diagram = voronoi(sites);
        polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
        link = (link.data(diagram.links()), link.exit().remove());
        link = link
            .enter()
            .append("line")
            .merge(link)
            .call(redrawLink);
        site = site.data(sites).call(redrawSite);
    }

    function redrawPolygon(polygon) {
        polygon.attr("d", (d) => (d ? `M${d.join("L")}Z` : null));
    }

    function redrawLink(link) {
        link
            .attr("x1", (d) => d.source[0])
            .attr("y1", (d) => d.source[1])
            .attr("x2", (d) => d.target[0])
            .attr("y2", (d) => d.target[1]);
    }

    function redrawSite(site) {
        site.attr("cx", (d) => d[0]).attr("cy", (d) => d[1]);
    }
}

function displayPoly(polyCoords) {
    const outline = svg
        .append("polyline")
        .attr("class", "outline")
        .attr("points", polyCoords);

    // Make paper.js rectangle to punch the outline out of
    const pjsPoint = new paper.Point(0, 0);
    const pjsSize = new paper.Size(width, height);
    const pjsCover = new paper.Path.Rectangle(pjsPoint, pjsSize);

    // Convert paper.js path to d3 svg
    const cover = svg
        .append("path")
        .attr("class", "cover")
        .attr("d", pjsCover.pathData);

    // paper.js version of outline
    const pjsOutline = new paper.Path({
        segments: polyCoords,
        closed: true
    });
}
