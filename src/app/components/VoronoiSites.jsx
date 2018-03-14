/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import {
    voronoiDeleteSiteAction,
    voronoiMoveSiteAction
} from "../actions/actionGenerators";

import { Node } from "./Node";

export const VoronoiSites = connect()(({ dispatch, sites }) => (
    <g className="voronoiSites">
        {Object.entries(sites).map((entries) => {
            const [siteId, { point }] = entries;

            const deleteSite = () => {
                dispatch(voronoiDeleteSiteAction(siteId));
            };

            const moveSite = (newPoint) => {
                dispatch(voronoiMoveSiteAction(siteId, newPoint));
            };

            return (
                <Node
                    key={siteId}
                    nodeId={siteId}
                    point={point}
                    deleteNode={deleteSite}
                    moveNode={moveSite}
                />
            );
        })}
    </g>
));
