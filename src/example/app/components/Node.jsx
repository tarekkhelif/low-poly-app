// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types,
    react/require-default-props */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import type { Point, ID, NodeProps } from "../types/types.js";

import { deleteNodesAction, moveNodeAction } from "../store/appActions";


class Node extends React.Component<{point: Point, id: ID, ...NodeProps}> {
    componentDidMount() {
        const node = this.node;
        const deleteNode = this.props.deleteNode;
        const moveNode = this.props.moveNode;

        // MouseDown to delete
        if (deleteNode) {
            d3.select(node).on("mousedown.add", () => {
                deleteNode();
            });
        }

        // Click and drag to move
        if (moveNode) {
            d3.select(node).call(d3.drag().on("drag.node", () => {
                moveNode(d3.event.dx, d3.event.dy);
            }));
        }
    }

    node: ?Element;

    render() {
        return (<circle
            className={this.props.className}
            id={this.props.id}
            ref={(el) => {
                this.node = el;
            }}
            cx={this.props.point[0]}
            cy={this.props.point[1]}
        />);
    }
}

const NodeContainer = connect(
    null,
    (dispatch, { id }) => ({
        // deleteNode: () => dispatch(deleteNodesAction(id)),
        moveNode: (dx, dy) => dispatch(moveNodeAction(id, dx, dy))
    })
)(Node);


export const Nodes = ({ nodes, className }) => (
    <g className={`${className}s`}>
        {Object.entries(nodes).map(([id, point]) => (
            <NodeContainer
                key={id}
                id={id}
                className={className}
                point={point}
            />
        ))}
    </g>
);

