/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { ToolButtons } from "./ToolButtons";
import { ConnectedActiveToolUI } from "./ActiveToolUI";

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
                <ConnectedActiveToolUI />
            </svg>
        </div>);

function scaleDimensions(fullWidth, fullHeight) {
    if (fullWidth === 0 || fullHeight === 0) {
        throw new Error("Dimensions must be nonzero");
    }

    const width = 600;
    const height = fullHeight / fullWidth * width;

    return { width, height };
}

const mapStateToProps = (state) => {
    let rasterProps;
    const {
        rasterBase64,
        width: nativeWidth,
        height: nativeHeight
    } = state.raster;

    if (nativeHeight !== 0 && nativeHeight !== 0) {
        const { width, height } = scaleDimensions(nativeWidth, nativeHeight);
        rasterProps = { rasterBase64, width, height };
    } else {
        rasterProps = {
            rasterBase64,
            width: nativeWidth,
            height: nativeHeight
        };
    }

    return { ...rasterProps };
};
export const ConnectedApp = connect(mapStateToProps)(App);
