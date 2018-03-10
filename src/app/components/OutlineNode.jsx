/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

const mapStateToProps = ({}) => ({}); // {nodeId, point}
export const OutlineNode = connect(mapStateToProps)(class extends React.Component {
    componentDidMount() {
        const { point: [cx, cy], deleteNode, moveNode } = this.props;
        const { node } = this;

        d3.select(node).on("mousedown", () => {
            const correctModifiers =
                    !d3.event.ctrlKey &&
                    !d3.event.altKey &&
                    d3.event.shiftKey &&
                    !d3.event.button;
            if (correctModifiers) {
                deleteNode();
            }
        });

        // Click and drag to move
        d3.select(node).call(d3
            .drag()
            .filter(() => {
                const correctModifiers =
                            d3.event.ctrlKey &&
                            !d3.event.altKey &&
                            !d3.event.shiftKey &&
                            !d3.event.button;
                return correctModifiers;
            })
            .on("drag", () => {
                const newX = cx + d3.event.dx;
                const newY = cy + d3.event.dy;
                moveNode([newX, newY]);
            }));
    }

    render() {
        const { nodeId, point: [cx, cy] } = this.props;

        return (
            <circle
                key={nodeId}
                id={nodeId}
                className="outlineNode"
                cx={cx}
                cy={cy}
                ref={(node) => {
                    this.node = node;
                }}
            />
        );
    }
});
