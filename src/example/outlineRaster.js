import * as d3 from "d3";

const paper = require("paper");

export async function outlineRaster() {
    // REAL // UI for drawing outline
    // MOCK // Load outline this.data from file
    const rawOutlineData = await d3.text(this.exampleData.outlineExampleData);
    const outlineData = d3.csvParseRows(rawOutlineData, (row) =>
        row.map((value) => +value));

    // Make d3 version of outline
    const d3Outline = this.d3Project.svg
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

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Outline });
    Object.assign(this.pjsProject, { pjsOutline });
    Object.assign(this.data, { outlineData });
}
