// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { MESH_NODE, MESH_POLY, DELETE, MOVE } from "../store/actions";

import { Polygons } from "./Polygons";
import { Nodes } from "./Node";

const Tesselation = ({ meshNodes, meshPolygons }) => {
    const allowedActions = {};
    allowedActions[DELETE] = false;
    allowedActions[MOVE] = true;

    return (
        <g className="tesselation">
            <Polygons
                className={MESH_POLY}
                nodes={meshNodes}
                polygons={meshPolygons}
            />
            <Nodes
                className={MESH_NODE}
                nodes={meshNodes}
                allowedActions={allowedActions}
            />
        </g>
    );
};

const mapStateToProps = (state) => ({
    meshNodes: state[MESH_NODE],
    meshPolygons: state[MESH_POLY]
});

// $FlowFixMe
export const TesselationContainer = connect(mapStateToProps)(Tesselation);
