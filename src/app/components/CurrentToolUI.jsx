/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_TOOL, TESSELATION_TOOL } from "../actions/actionTypes";

import { OutlineToolUI } from "./OutlineToolUI";
import { TesselationToolUI } from "./TesselationToolUI";
import { DefaultToolUI } from "./DefaultToolUI";

const toolUIs = new Map([
    [OUTLINE_TOOL, OutlineToolUI],
    [TESSELATION_TOOL, TesselationToolUI]
]);

const mapStateToProps = ({ currentTool: { tool } }) => ({ tool });
export const CurrentToolUI = connect(mapStateToProps)(({ tool }) => {
    if (toolUIs.has(tool)) {
        const ToolUI = toolUIs.get(tool);
        return <ToolUI />;
    }
    return <DefaultToolUI />;
});
