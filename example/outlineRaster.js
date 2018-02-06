// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false */

export async function outlineRaster(svg, paper, exampleData) {
    // REAL // UI for drawing outline
    // MOCK // Load outline data from file
    const rawOutlineData = await d3.text(exampleData.outlineFilePath);
    const outlineData = d3.csvParseRows(rawOutlineData, (row) =>
        row.map((value) => +value));

    // Make d3 version of outline
    const d3Outline = svg
        .append("g")
        .classed("outline", true)
        .append("path")
        .attr("d", `M${outlineData.join("L")}Z`);

    // Make paper.js version of outline
    const pjsOutline = new paper.Path({
        segments: outlineData,
        closed: true,
        strokeColor: "black"
    });

    return {
        svg,
        paper,
        outlineData
    };
}
