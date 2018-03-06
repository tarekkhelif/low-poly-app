// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { PointType, NodeIdType, PolygonIdType, ColorStringType } from
    "../types/types";

const PolygonComponent = ({
    id,
    points,
    color
}: {
        id: PolygonIdType,
        points: PointType[],
        color: ColorStringType
    }) =>
    (
        <path
            className="polygon"
            id={id}
            d={`M${points.join("L")}Z`}
            style={{ fill: color, stroke: color }}
        />
    );

// Wrap the `PolygonComponent` in a container component
// The container component maps the `NodeIdType`s that define the polygon to
//   the actually coordinates the `NodeIdType` corresponds to
const mapStateToProps = (state, { nodes, nodeIds }) => ({
    points: nodeIds.map((nodeId: NodeIdType): PointType => nodes[nodeId].point)
});
// $FlowFixMe
const PolygonContainer = connect(mapStateToProps)(PolygonComponent);

export const Polygons = ({ className, polygons, ...props }: Object) => (
    <g className={`${className}s`}>
        {Object.entries(polygons).map(([polygonId, polygon]) => (
            <PolygonContainer
                key={polygonId}
                id={polygonId}
                className={className}
                {...polygon} // nodeIds, color
                {...props} // nodes
            />
        ))}
    </g>
);
