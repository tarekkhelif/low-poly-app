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

import { ReduxTesselation } from "./types/types";
import { editTesselationStageReducer } from "./store/tesselationReducer";
import { TesselationContainer } from "./components/Tesselation";

class TesselationEditor {
    stageGroup: Element;
    tesslationData: ReduxTesselation;
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

        const initialState = that.store.getState().tesselation;
        this.store = createStore(editTesselationStageReducer, initialState);
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

/* function reformatTesselation(oldTesselation: OldTesselation): ReduxTesselation {
    const { oldPolygons, oldEdges, oldNodes } = oldTesselation;

    const nodeIDer = new IncrementalId("node");
    const edgeIDer = new IncrementalId("edge");
    const polygonIDer = new IncrementalId("polygon");

    const nodes: Node[] = oldNodes.map((node: OldNode): Node => ({
        id: nodeIDer.newId(),
        point: node
    }));
    const edges: Edge[] = oldEdges.map((edge: OldEdge): Edge => {
        const [p1Id, p2Id] = edge.map((p) => {
            const pId = nodes.reduce(
                (found, { point, id }) => found || (p === point ? id : false),
                false
            );
            return pId;
        });

        return { id: edgeIDer.newId(), edge: [p1Id, p2Id] };
    });
    const polygons: Polygon[] = oldPolygons.map((polygon: OldPolygon): Polygon => {});

    return {
        nodes,
        edges,
        polygons
    };
} */
