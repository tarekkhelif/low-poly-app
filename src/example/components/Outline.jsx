/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { OUTLINE, SEED, addNodesAction } from "../store/actions";

class Outline extends React.Component {
    componentDidMount() {
        d3.select(this.outline).on("mousedown.add", () => {
            this.props.addSites(d3.mouse(this.outline));
        });
    }

    render() {
        return (
            <g className={`${OUTLINE}s`}>
                <path
                    className={OUTLINE}
                    d={`M${this.props.outlinePoints.join("L")}Z`}
                    ref={(el) => {
                        this.outline = el;
                    }}
                />
            </g>
        );
    }
}

export const OutlineConnector = connect(
    (state) => ({
        outlinePoints: Object.values(state[OUTLINE]).map(({ point }) => point)
    }),
    (dispatch) => ({
        addSites: (point) => dispatch(addNodesAction(SEED, point))
    })
)(Outline);
