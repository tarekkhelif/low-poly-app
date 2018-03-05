// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { MESH_NODE, MESH_POLY } from "../store/actions";

import { Polygons } from "./Polygons";
import { Nodes } from "./Node";

const Tesselation = ({ meshNodes, meshPolygons }) => (
    <g className="tesselation">
        <Polygons polygons={meshPolygons} />
        <Nodes className={MESH_NODE} nodes={meshNodes} />
    </g>
);

const mapStateToProps = (state) => ({
    meshNodes: state[MESH_NODE],
    meshPolygons: state[MESH_POLY]
});

// $FlowFixMe
export const TesselationContainer = connect(mapStateToProps)(Tesselation);
