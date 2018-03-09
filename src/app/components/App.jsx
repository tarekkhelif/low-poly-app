/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { ToolButtons } from "./ToolButtons";

const patches = [];

const App = ({ rasterBase64, width, height }) =>
    (
        <div className="app">
            <div className="pane">
                <ToolButtons />
                <div className="currentToolOptions"></div>
            </div>
            <svg
                className="workspace"
                width={width}
                height={height}
            >
                <image
                    className="raster"
                    href={rasterBase64}
                    width={width}
                    height={height}
                />
                <g className="patches">
                    {patches.forEach((patch) => (
                        <g className="currentTool-ui"></g>))
                    }
                </g>
            </svg>
        </div>);

const mapStateToProps = (state) => {
    const { rasterBase64, width, height } = state.raster;
    return { rasterBase64, width, height };
};
export const ConnectedApp = connect(mapStateToProps)(App);
