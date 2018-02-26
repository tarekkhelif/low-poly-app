/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";

import * as d3 from "d3";

class Site extends React.Component {
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

export class Outline extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        d3.select(this.outline).on("mousedown.add", () => {
            this.reportAction({
                type: "ADD_SITES",
                sites: [d3.mouse(this.outline)]
            });
        });
    }

    reportAction(action) {
        console.log(action);
    }

    render() {
        return (
            <g className="outlines" onMouseDown={this.handleMouseDown}>
                <path
                    className="outline"
                    d={`M${this.props.outlineData.join("L")}Z`}
                    ref={(el) => {
                        this.outline = el;
                    }}
                />
            </g>
        );
    }
}

export class Sites extends React.Component {
    constructor(props) {
        super(props);

        this.justExists = "justExists";
    }

    render() {
        return (
            <g className="sites">
                {this.props.sites.map((point) => (
                    <Site active={this.props.active} point={point} />
                ))}
            </g>
        );
    }
}
