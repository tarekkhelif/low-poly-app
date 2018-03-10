/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

const mapStateToProps = () => ({});
export const Outline = ({ id, outline }) => {
    const { nodes } = outline;
    const outlinePoints = Object.entries(nodes).map((entry) => {
        const [outlineNodeId, { point }] = entry;
        return point;
    });

    const outlinePathString =
        outlinePoints.length > 0 ? `M ${outlinePoints.join(" L ")} Z` : "";

    return <path key={id} id={id} className="outline" d={outlinePathString} />;
};
