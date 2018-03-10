/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

const mapStateToProps = ({}) => ({});
export const Nodes = connect(mapStateToProps)(({ nodes, selected }) => (
    <g
        className="outlineNodes"
        visibility={selected ? "inherit" : "hidden"}
    >
        {Object.entries(nodes).map((entry) => {
            const [nodeId, { point: [cx, cy] }] = entry;
            return (
                <circle
                    key={nodeId}
                    id={nodeId}
                    className="outlineNode"
                    cx={cx}
                    cy={cy}
                />
            );
        })}
    </g>
));
