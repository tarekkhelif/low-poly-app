// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as d3 from "d3";

import { TesselationContainer } from "./components/Tesselation";

class TesselationEditor {
    stageGroup: Element;
    store: Object;

    constructor(that) {
        const stageGroup = d3
            .select("#svgProject")
            .append("g")
            .classed("tesselationStage", true)
            .node();

        if (stageGroup === null) {
            throw new Error("stageGroup g doesn't exist");
        }
        this.stageGroup = stageGroup;

        this.store = that.store;
    }

    run() {
        ReactDOM.render(
            <Provider store={this.store}>
                <TesselationContainer />
            </Provider>,
            this.stageGroup
        );
    }
}

// Coerce siteChooser to work the old way; like a function, not an object
export function editTesselation() {
    const miniApp = new TesselationEditor(this);
    miniApp.run();
}
