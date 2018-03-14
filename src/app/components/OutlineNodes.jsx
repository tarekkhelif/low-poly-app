/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import {
    outlineDeleteNodeAction,
    outlineMoveNodeAction
} from "../actions/actionGenerators";

import { Node } from "./Node";

const mapStateToProps = ({ patches }, { patchId }) => ({
    nodes: patches[patchId].outline.nodes
});
export const OutlineNodes = connect(mapStateToProps)(({
    dispatch, patchId, nodes, visibility
}) => (
    <g className="outlineNodes" visibility={visibility}>
        {Object.entries(nodes).map((entries) => {
            const [nodeId, { point }] = entries;

            const deleteNode = () => {
                dispatch(outlineDeleteNodeAction(patchId, nodeId));
            };

            const moveNode = (newPoint) => {
                dispatch(outlineMoveNodeAction(patchId, nodeId, newPoint));
            };

            return (
                <Node
                    key={nodeId}
                    nodeId={nodeId}
                    point={point}
                    deleteNode={deleteNode}
                    moveNode={moveNode}
                />
            );
        })}
    </g>
));
