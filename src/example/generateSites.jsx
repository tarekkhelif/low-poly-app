// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as d3 from "d3";

import type { CoordinatesType } from "./types/types.js";

import { NumPicker } from "./components/NumPicker";
import { EndStage } from "./components/EndStage";
import { SitesConnector } from "./components/Sites";

class SiteChooser {
    stageGroup: Element;
    stageTools: Element;
    outlineData: CoordinatesType;
    store: Object;

    constructor(that) {
        const stageGroup = d3
            .select("#svgProject")
            .append("g")
            .classed("sitesStage", true)
            .node();

        if (stageGroup === null) {
            throw new Error("stageGroup g doesn't exist");
        }
        this.stageGroup = stageGroup;

        const stageTools = document.querySelector("#stageTools");
        if (stageTools === null) {
            throw new Error("stageTools div doesn't exist");
        }
        this.stageTools = stageTools;

        this.store = that.store;
    }

    run() {
        ReactDOM.render(
            <Provider store={this.store}>
                <Fragment>
                    <NumPicker />
                    <EndStage />
                </Fragment>
            </Provider>,
            this.stageTools
        );
        ReactDOM.render(
            <Provider store={this.store}>
                <SitesConnector />
            </Provider>,
            this.stageGroup
        );
    }
}

// Coerce siteChooser to work the old way; like a function, not an object
export function chooseSites() {
    const miniApp = new SiteChooser(this);
    miniApp.run();
}
