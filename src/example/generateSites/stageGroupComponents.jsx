/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";

export class Site extends React.Component {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <circle
                className="site"
                cx={this.props.point[0]}
                cy={this.props.point[1]}
            />
        );
    }
}
