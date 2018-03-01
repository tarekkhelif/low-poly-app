// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import * as d3 from "d3";

import { siteStageReducer } from "./store/sitesReducer";
import { PaneTools } from "./components/paneToolsComponents";
import {
    OutlineContainer,
    SitesContainer
} from "./components/stageGroupComponents";

class SiteChooser {
    stageGroup: Element;
    stageTools: Element;
    outlineData: number[][];
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

        this.outlineData = that.data.outlineData;

        const initialState = {
            globalState: that.data,
            outlineData: that.data.outlineData
        };

        this.store = createStore(siteStageReducer, initialState);
    }

    run() {
        ReactDOM.render(
            <Provider store={this.store}>
                <PaneTools />
            </Provider>,
            this.stageTools
        );
        ReactDOM.render(
            <Provider store={this.store}>
                <g className="helpProvider">
                    <OutlineContainer />
                    <SitesContainer />
                </g>
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
