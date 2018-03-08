/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { OUTLINE, SEED, addNodesAction, setEditingOutlineAction } from "../store/actions";

class Outline extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mousePoint: undefined
        };
        this.outlineID = "outlineID";
        this.firstClass = "firstOutlineNode";
    }

    componentDidMount() {
        d3.select("#svgProject").on("mousedown", (() => {
            if (this.props.editing &&
                !d3.event.target.classList.contains(this.firstClass)) {
                this.props.addNode(this.state.mousePoint);
            }
        }));

        d3.select("#svgProject").on("mousemove", () => {
            if (this.props.editing) {
                this.setState({ mousePoint: d3.mouse(this.outline) });
            }
        });

        d3.select(this.outline).on("mousedown", () => {
            if (!this.props.editing) {
                this.props.addSite(d3.mouse(this.outline));
            }
        });
    }

    render() {
        const editing = this.props.editing;
        const outlineNodes = { ...this.props.outlineNodes };

        if (editing && this.state.mousePoint) {
            outlineNodes[`${this.outlineID}-next`] =
                { point: this.state.mousePoint };
        }

        const outlinePoints = Object.values(outlineNodes)
            .map(({ point }) => point);

        const pathString = outlinePoints.length > 0
            ? `M ${outlinePoints.join("L")}${editing ? "" : "Z"}`
            : "";

        const nodeElements = Object.entries(outlineNodes)
            .map(([id, { point }], i, arr) => {
                const firstNodeProps = (
                    i === 0 &&
                    arr.length > 3 &&
                    editing)
                    ? {
                        className: [this.outlineID, this.firstClass].join(" "),
                        onMouseDown: () => {
                            this.props.setEditing(false);
                        },
                        style: {
                            fill: "orange",
                            stroke: "orange"
                        }
                    }
                    : {};

                const lastNodeProps = (
                    i === arr.length - 1 &&
                    editing)
                    ? {
                        style: { pointerEvents: "none" }
                    }
                    : {};

                return (<circle
                    className={this.outlineID}
                    key={id}
                    id={id}
                    cx={point[0]}
                    cy={point[1]}
                    {...firstNodeProps}
                    {...lastNodeProps}
                />);
            });

        return (
            <g className={this.outlineID}>
                <path
                    className={this.outlineID}
                    d={pathString}
                    pointerEvents="fill"
                    ref={(el) => { this.outline = el; }}
                />
                <g className={`${this.outlineID}Nodes`}>
                    {nodeElements}
                </g>
            </g>
        );
    }
}

export const OutlineConnector = connect(
    (state, /* { this.outlineID } */) => ({
        outlineNodes: state[OUTLINE]/* [this.outlineID].nodes */,
        editing: state.editingOutline,
        active: state.active
    }),
    (dispatch) => ({
        setEditing: (editing) => dispatch(setEditingOutlineAction(editing)),
        addNode: (point) => dispatch(addNodesAction(OUTLINE, point)),
        addSite: (point) => dispatch(addNodesAction(SEED, point)),
    })
)(Outline);
