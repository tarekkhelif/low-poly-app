// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as d3 from "d3";

import { OUTLINE, setEditingOutlineAction } from "./store/actions";

import { OutlineConnector } from "./components/Outline.jsx";

export async function outlineRaster() {
    this.store.dispatch(setEditingOutlineAction(true));

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
