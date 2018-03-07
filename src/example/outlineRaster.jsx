// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as d3 from "d3";

import { OUTLINE, addNodesAction } from "./store/actions";

import { OutlineConnector } from "./components/Outline.jsx";

export async function outlineRaster() {
    const addNodes = (...points) =>
        this.store.dispatch(addNodesAction(OUTLINE, ...points));

    d3.select("#svgProject").on("mousedown", (d, i, nodes) => {
        addNodes(d3.mouse(nodes[i]));
    });


    // REAL // UI for drawing outline
    // MOCK // Load outline this.data from file
    // const rawOutlineData = await d3.text(this.exampleData.outlineExampleData);
    // const outlineData = d3.csvParseRows(rawOutlineData, (row) =>
    //     row.map((value) => +value));

    // addNodes(...outlineData);

    const outlineGroup = d3
        .select("#svgProject")
        .append("g")
        .classed(OUTLINE, true)
        .node();

    ReactDOM.render(
        <Provider store={this.store}>
            <OutlineConnector />
        </Provider>,
        outlineGroup
    );
}
