/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

export const Mesh = ({ id, mesh }) => {
    const { nodes, polygons } = mesh;

    return (
        <g id={id} className="mesh">
            {Object.entries(polygons).map((entry) => {
                const [polygonId, { nodeIds, color }] = entry;

                const points = nodeIds.map((nodeId) => {
                    const { point } = nodes[nodeId];
                    return point;
                });

                const pathString =
                    points.length > 0 ? `M ${points.join(" L ")} Z` : "";

                return (
                    <path
                        key={polygonId}
                        id={polygonId}
                        className="polygon"
                        d={pathString}
                        style={{ stroke: color, fill: color }}
                    />
                );
            })}
        </g>
    );
};
