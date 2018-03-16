/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { ToolButtons } from "./ToolButtons";
import { CurrentToolUI } from "./CurrentToolUI";
import { CurrentToolControls } from "./CurrentToolControls";

const mapStateToProps = ({ raster: { rasterBase64, width, height } }) => ({
    rasterBase64,
    width,
    height
});
export const App = connect(mapStateToProps)((props) => {
    const { rasterBase64, width, height } = props;

    return (
        <div className="app">
            <div className="pane">
                <ToolButtons />
                <CurrentToolControls />
            </div>
            <svg
                className="workspace"
                width={width}
                height={height}
                role="presentation"
            >
                <image
                    className="raster"
                    href={rasterBase64}
                    width={width}
                    height={height}
                />
                <CurrentToolUI />
            </svg>
        </div>
    );
});
