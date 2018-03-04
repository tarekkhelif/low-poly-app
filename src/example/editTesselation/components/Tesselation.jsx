// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { Polygons } from "./Polygons";
import { Nodes } from "../../app/components/Node";

const Tesselation = ({ meshNodes, polygons }) => (
    <g className="tesselation">
        <Polygons polygons={polygons} />
        <Nodes className="meshNode" nodes={meshNodes} />
    </g>
);

const mapStateToProps = (state) => ({
    meshNodes: state.nodes,
    polygons: state.polygons
});

export const TesselationContainer = connect(mapStateToProps)(Tesselation);
