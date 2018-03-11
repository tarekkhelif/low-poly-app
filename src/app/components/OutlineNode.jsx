/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

import * as d3 from "d3";

export const OutlineNode = class extends React.Component {
    componentDidMount() {
        const { deleteNode, moveNode } = this.props;
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
                /* Read `point` during event.
                    If we read `point` at the beginning of `componentDidMount`,
                    like we do for other props, we'd alway be referencing the
                    coordinates from when the node first rendered and `dx`, `dy`
                    wouldn't accumulate. */

                const { point: [cx, cy] } = this.props;

                const newX = cx + d3.event.dx;
                const newY = cy + d3.event.dy;
                moveNode([newX, newY]);
            }));
    }

    render() {
        const { nodeId, point: [cx, cy] } = this.props;

        return (
            <circle
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
};
