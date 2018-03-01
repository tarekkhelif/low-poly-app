// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { Polygons } from "./Polygons";
import { MeshNodes } from "./MeshNodes";

const Tesselation = ({ nodes, polygons }) => (
    <g className="tesselation">
        <Polygons polygons={polygons} />
        <MeshNodes nodes={nodes} />
    </g>
);

const mapStateToProps = (state) => ({
    nodes: state.nodes,
    polygons: state.polygons
});

export const TesselationContainer = connect(mapStateToProps)(Tesselation);
