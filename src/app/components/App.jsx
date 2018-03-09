/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

import { ToolButtons } from "./ToolButtons";

const patches = [];

export const App = () => (
    <div className="app">
        <div className="pane">
            <ToolButtons />
            <div className="currentToolOptions"></div>
        </div>
        <svg className="workspace">
            <g className="raster"></g>
            <g className="patches">
                {patches.forEach((patch) => (
                    <g className="currentTool-ui"></g>))
                }
            </g>
        </svg>
    </div>);
