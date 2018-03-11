/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import {
    deleteOutlineNodeAction,
    moveOutlineNodeAction
} from "../actions/actionGenerators";

import { OutlineNode } from "./OutlineNode";

const mapStateToProps = ({ patches }, { patchId }) => ({
    nodes: patches[patchId].outline.nodes
});
export const OutlineNodes = connect(mapStateToProps)(({
    dispatch, patchId, nodes, selected
}) => (
    <g
        className="outlineNodes"
        visibility={selected ? "inherit" : "hidden"}
    >
        {Object.entries(nodes).map((entries) => {
            const [nodeId, { point }] = entries;

            const deleteNode = () => {
                dispatch(deleteOutlineNodeAction(patchId, nodeId));
            };

            const moveNode = (newPoint) => {
                dispatch(moveOutlineNodeAction(patchId, nodeId, newPoint));
            };

            return (
                <OutlineNode
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
