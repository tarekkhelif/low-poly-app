/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import * as d3 from "d3";

import { reducer } from "./generateSites/sitesReducer";
import { PaneTools } from "./generateSites/paneToolsComponents";
import { Outline, SitesContainer } from "./generateSites/stageGroupComponents";

class SiteChooser {
    stageGroup: Element;
    stageTools: Element;
    outlineData: number[][];

    constructor(that) {
        const stageGroup = d3
            .select("#svgProject")
            .append("g")
            .classed("sitesStage", true)
            .node();

        if (stageGroup === null) {
            throw new Error("stageTools div doesn't exist");
        } else {
            this.stageGroup = stageGroup;
        }

        const stageTools = document.querySelector("#stageTools");
        if (stageTools === null) {
            throw new Error("stageTools div doesn't exist");
        } else {
            this.stageTools = stageTools;
        }

        this.outlineData = that.data.outlineData;

        const initialState = {
            active: true,
            sites: Array.from(Array(20)).map((_, i) => ({
                point: [Math.random() * 400 + 100, Math.random() * 400 + 100],
                id: `initial-site-${i}`
            }))
        };

        this.store = createStore(reducer, initialState);
    }

    run() {
        ReactDOM.render(
            <PaneTools active={this.store.getState().active} />,
            this.stageTools
        );
        ReactDOM.render(
            <Provider store={this.store}>
                <g className="helpProvider">
                    <Outline outlineData={this.outlineData} />
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
