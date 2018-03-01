// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { Node } from "../../app/components/Node";
import type { Point, NodeId } from "../types/types.js";

import { moveNodeAction } from "../store/tesselationActions";

export const MeshNodes = ({ nodes }: { nodes: Object }) => (
    <g className="nodes">
        {Object.entries(nodes).map((entry) => {
            const id: NodeId = entry[0];
            const point: Point = entry[1];
            return (
                <Node key={id} id={id} className="meshNode" point={point} />
            );
        })}
    </g>
);

// (dispatch) => ({
//     moveNode: (node, newLocation) =>
//         dispatch(moveNodeAction(node.id, newLocation))
// })
