/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { noop } from "../util/funcTools";

import { meshMoveNodeAction } from "../actions/actionGenerators";

import { Node } from "./Node";

const mapStateToProps = ({ patches }, { patchId }) => ({
    nodes: patches[patchId].mesh.nodes
});
export const MeshNodes = connect(mapStateToProps)(({ dispatch, patchId, nodes }) => (
    <g className="outlineNodes">
        {Object.entries(nodes).map((entries) => {
            const [nodeId, { point }] = entries;

            const moveNode = (newPoint) => {
                dispatch(meshMoveNodeAction(patchId, nodeId, newPoint));
            };

            return (
                <Node
                    key={nodeId}
                    nodeId={nodeId}
                    point={point}
                    deleteNode={noop}
                    moveNode={moveNode}
                />
            );
        })}
    </g>
));
