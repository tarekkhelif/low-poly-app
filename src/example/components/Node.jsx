// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types,
    react/require-default-props */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { PointType, IDType, NodeGroupType } from "../types/types.js";

import { deleteNodesAction, moveNodeAction, DELETE, MOVE } from
    "../store/actions";


class Node extends React.Component<{
    className: NodeGroupType,
    id: IDType,
    point: PointType,
    allowedActions: Object,
    deleteNode: (id: IDType) => void,
    moveNode: (id: IDType, newPoint: PointType) => void

}> {
    componentDidMount() {
        const node = d3.select(this.node);
        // const point = this.props.point;
        const deleteNode = this.props.deleteNode;
        const moveNode = this.props.moveNode;

        // MouseDown to delete
        if (this.props.allowedActions[DELETE]) {
            node.on("mousedown", () => {
                if (!d3.event.ctrlKey &&
                    !d3.event.altKey &&
                    d3.event.shiftKey &&
                    !d3.event.button) { deleteNode(); }
            });
        }

        // Click and drag to move
        if (this.props.allowedActions[MOVE]) {
            node.call(d3.drag()
                .filter(() => (d3.event.ctrlKey &&
                    !d3.event.altKey &&
                    !d3.event.shiftKey &&
                    !d3.event.button))
                .on("drag", () => {
                    const newX = this.props.point[0] + d3.event.dx;
                    const newY = this.props.point[1] + d3.event.dy;
                    moveNode([newX, newY]);
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
    (dispatch, { className, id }) => ({
        deleteNode: () => dispatch(deleteNodesAction(className, id)),
        moveNode: (newPoint) =>
            dispatch(moveNodeAction(className, id, newPoint))
    })
)(Node);

// $FlowFixMe
export const Nodes = ({ className, nodes, ...props }) =>
    (
        <g className={`${className}s`}>
            {/* $FlowFixMe */}
            {Object.entries(nodes).map(([id, { point }]) => (
                <NodeContainer
                    key={id}
                    id={id}
                    className={className}
                    point={point}
                    {...props} // allowedActions
                />
            ))}
        </g>
    );
