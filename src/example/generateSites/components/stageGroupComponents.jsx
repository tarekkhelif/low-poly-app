/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { Node } from "../../app/components/Node";

import {
    addSitesAction,
    deleteSitesAction,
    moveSiteAction
} from "../store/sitesActions";

class Outline extends React.Component {
    componentDidMount() {
        d3.select(this.outline).on("mousedown.add", () => {
            this.props.addSites(d3.mouse(this.outline));
        });
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

export const OutlineContainer = connect(
    (state) => ({ outlineData: state.outlineData }),
    (dispatch) => ({
        addSites: (point) => dispatch(addSitesAction(point))
    })
)(Outline);

const Sites = ({ sites, deleteSites }) => (
    <g className="sites">
        {sites.map(({ id, point }) => (
            <Node
                key={id}
                id={id}
                className="site"
                point={point}
                onMouseDown={() => deleteSites(id)}
            />
        ))}
    </g>
);

export const SitesContainer = connect(
    (state) => ({ sites: state.sites }),
    (dispatch) => ({
        deleteSites: (id) => dispatch(deleteSitesAction(id))
    })
)(Sites);
