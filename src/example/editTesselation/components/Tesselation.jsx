// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { Polygons } from "./Polygons";
import { Nodes } from "./Nodes";

const Tesselation = ({ nodes, polygons }) => (
    <g className="tesselation">
        <Polygons polygons={polygons} />
        <Nodes nodes={nodes} />
    </g>
);

const mapStateToProps = (state) => ({
    nodes: state.nodes,
    polygons: state.polygons
});

export const TesselationContainer = connect(mapStateToProps)(Tesselation);

// (dispatch) => ({
//     moveNode: (node, newLocation) =>
//         dispatch(moveNodeAction(node.id, newLocation))
// })
