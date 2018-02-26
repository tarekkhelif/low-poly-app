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
        this.props.executeAction({ type: "ADD_RAND_SITES", n: this.state.n });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        const input = this.state.value;
        let n;
        if (input <= this.min) n = this.min;
        else if (input >= this.max) n = this.max;
        else n = input;

        return (
            <div className="numPicker">
                <input
                    id="numberPickerInput"
                    type="number"
                    value={n}
                    disabled={!this.props.active}
                    onChange={this.handleChange}
                />
                <button
                    id="numPickerButton"
                    disabled={!this.props.active}
                    onClick={this.handleChange}
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
        this.props.executeAction({ type: "KILL_STAGE" });
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
