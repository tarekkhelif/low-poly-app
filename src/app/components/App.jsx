/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { ToolButtons } from "./ToolButtons";
import { ConnectedActiveToolUI } from "./ActiveToolUI";

const setSelectionAction = () => ({ type: "SET_SELECTION", payload: {} });

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
export const App = connect(mapStateToProps)((props) => {
    const {
        dispatch, rasterBase64, width, height
    } = props;

    return (
        <div className="app" onMouseDown={() => dispatch(setSelectionAction())}>
            <div className="pane">
                <ToolButtons />
                <div className="currentToolOptions" />
            </div>
            <svg className="workspace" width={width} height={height}>
                <image
                    className="raster"
                    href={rasterBase64}
                    width={width}
                    height={height}
                />
                <ConnectedActiveToolUI />
            </svg>
        </div>
    );
});

function scaleDimensions(fullWidth, fullHeight) {
    if (fullWidth === 0 || fullHeight === 0) {
        throw new Error("Dimensions must be nonzero");
    }

    const width = 600;
    const height = fullHeight / fullWidth * width;

    return { width, height };
}
