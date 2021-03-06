/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

export const Outline = ({
    id, selected, closed, outline
}) => {
    const className = `outline${selected ? " selected" : ""}`;

    const { nodes } = outline;

    const points = Object.entries(nodes).map((entry) => {
        const [nodeId, { point }] = entry;
        return point;
    });

    const pathString =
        points.length > 0 ? `M ${points.join(" L ")}${closed ? " Z" : ""}` : "";

    const pointerEvents = closed ? "visible" : "stroke";

    return (
        <path
            key={id}
            id={id}
            className={className}
            d={pathString}
            style={{ pointerEvents }}
        />
    );
};
