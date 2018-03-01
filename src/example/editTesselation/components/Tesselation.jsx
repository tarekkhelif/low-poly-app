// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { Polygons } from "./Polygon";
import { Nodes } from "./Node";

const Tesselation = (nodes, polygons) => (
    <g className="tesselation">
        <Polygons polygons={polygons} />
        <Nodes nodes={nodes} />
    </g>
);

export const TesselationConnector = connect((state) => ({
    nodes: state.nodes,
    polygons: state.polygons
}))(Tesselation);

// (dispatch) => ({
//     moveNode: (node, newLocation) =>
//         dispatch(moveNodeAction(node.id, newLocation))
// })
