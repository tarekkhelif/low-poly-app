// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import type {
    Point,
    NodeId,
    Polygon,
    PolygonId,
    ColorString
} from "../types/types";

const PolygonComponent = (
    id: PolygonId,
    points: Point[],
    color: ColorString
) => (
    <path
        className="polygon"
        id={id}
        d={`M${points.join("L")}Z`}
        style={`fill: ${color} stroke: ${color}`}
    />
);

// Wrap the `PolygonComponent` in a container component
// The container component maps the `NodeId`s that define the polygon to
//   the actually coordinates the `NodeId` corresponds to
const mapStateToProps = (state, { nodes: nodeIds }) => ({
    points: nodeIds.map((nodeId: NodeId): Point => state.nodes[nodeId].point)
});
const PolygonContainer = connect(mapStateToProps)(PolygonComponent);

export const Polygons = (polygons: Polygon[]) => (
    <g className="polygons">
        {Object.entries(polygons).map(([key, value]) => {
            const polygonId: PolygonId = key;
            const polygon: Polygon = value;
            const { nodes, color } = polygon;
            return (
                <PolygonContainer
                    key={polygonId}
                    id={polygonId}
                    nodes={nodes}
                    color={color}
                />
            );
        })}
    </g>
);
