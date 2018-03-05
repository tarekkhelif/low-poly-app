/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { randPtInPoly } from "../util/geometry.js";

import {
    SEED,
    OUTLINE,
    addNodesAction,
} from "../store/actions";

export const NumPicker = connect((state) => ({
    active: state.active,
    outlinePoints: Object.values(state[OUTLINE]).map(({ point }) => point)
}))(class extends React.Component {
    constructor(props) {
        super(props);

        this.min = 0;
        this.max = 100;

        this.state = { value: 25 };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const inputInt = parseInt(e.target.value);

        let value;
        if (inputInt < this.min) value = this.min;
        else if (this.min <= inputInt && inputInt <= this.max) {
            value = inputInt;
        } else if (this.max < inputInt) value = this.max;
        else value = 0;

        this.setState({ value });
    }

    handleClick() {
        const randPoints = Array.from(Array(this.state.value)).map(() =>
            randPtInPoly(this.props.outlinePoints));

        const action = addNodesAction(SEED, ...randPoints);
        this.props.dispatch(action);
    }

    render() {
        return (
            <div className="numPicker">
                <input
                    id="numberPickerInput"
                    value={this.state.value}
                    disabled={!this.props.active}
                    onChange={this.handleChange}
                />
                <button
                    id="numPickerButton"
                    disabled={!this.props.active}
                    onClick={this.handleClick}
                >
                    ➡
                </button>
            </div>
        );
    }
});
