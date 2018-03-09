/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { ToolButtons } from "./ToolButtons";

const patches = [];

const App = ({ raster }) => (
    <div className="app">
        <div className="pane">
            <ToolButtons />
            <div className="currentToolOptions"></div>
        </div>
        <svg className="workspace">
            <image
                className="raster"
                href={raster}
            />
            <g className="patches">
                {patches.forEach((patch) => (
                    <g className="currentTool-ui"></g>))
                }
            </g>
        </svg>
    </div>);

const mapStateToProps = ({ raster }) => ({ raster });
export const ConnectedApp = connect(mapStateToProps)(App);
