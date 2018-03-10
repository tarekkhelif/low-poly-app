/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

export const Outline = ({ id, outline }) => {
    const { nodes } = outline;

    const points = Object.entries(nodes).map((entry) => {
        const [nodeId, { point }] = entry;
        return point;
    });

    const pathString = points.length > 0 ? `M ${points.join(" L ")} Z` : "";

    return <path key={id} id={id} className="outline" d={pathString} />;
};
