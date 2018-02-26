/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";

export class Site extends React.Component {
    constructor(props) {
        super(props);

        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleMouseDown() {
        this.reportAction({ type: "DELETE_SITES", sites: [this.props.point] });
    }

    reportAction(action) {
        console.log(action);
    }

    render() {
        return (
            <circle
                className="site"
                cx={this.props.point[0]}
                cy={this.props.point[1]}
                onMouseDown={this.handleMouseDown}
            />
        );
    }
}
