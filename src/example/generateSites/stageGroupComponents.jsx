/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { addSites, deleteSites, moveSite } from "./siteActions";

export class Outline extends React.Component {
    componentDidMount() {
        d3.select(this.outline).on("mousedown.add", () => {
            const action = addSites([d3.mouse(this.outline)]);
            this.reportAction(action);
        });
    }

    reportAction(action) {
        console.log(action);
    }

    render() {
        return (
            <g className="outlines">
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

const Sites = ({ sites, onSiteMouseDown }) => (
    <g className="sites">
        {sites.map(({ point, id }) => (
            <circle
                className="site"
                key={id}
                id={id}
                cx={point[0]}
                cy={point[1]}
                onMouseDown={() => onSiteMouseDown(id)}
            />
        ))}
    </g>
);

export const SitesContainer = connect(
    (state) => ({ sites: state.sites }),
    (dispatch) => ({
        onSiteMouseDown: (id) => dispatch(deleteSites(id))
    })
)(Sites);
