/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";

export class NumPicker extends React.Component {
    constructor(props) {
        super(props);

        this.min = 0;
        this.max = 100;

        this.state = { value: 25 };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick() {
        this.reportAction({ type: "ADD_RAND_SITES", n: this.state.value });
    }

    handleChange(e) {
        this.setState({ value: parseInt(e.target.value) });
    }

    reportAction(action) {
        console.log(action);
    }

    render() {
        const value = this.state.value;
        let renderVal;
        if (value < this.min) renderVal = this.min;
        else if (this.min <= value && value <= this.max) renderVal = value;
        else if (this.max < value) renderVal = this.max;
        else renderVal = 0;

        return (
            <div className="numPicker">
                <input
                    id="numberPickerInput"
                    value={renderVal}
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
}

export class EndStage extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.reportAction({ type: "KILL_STAGE" });
    }

    reportAction(action) {
        console.log(action);
    }

    render() {
        return (
            <div className="endStage">
                <button
                    id="endStageButton"
                    disabled={!this.props.active}
                    onClick={this.handleClick}
                >
                    Done with Seeds
                </button>
            </div>
        );
    }
}
