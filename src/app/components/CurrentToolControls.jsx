/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_TOOL } from "../actions/actionTypes";
import { OutlineToolControls } from "./OutlineToolControls";

const toolControls = new Map([[OUTLINE_TOOL, OutlineToolControls]]);

const mapStateToProps = ({ currentTool: { tool } }) => ({ tool });
export const CurrentToolControls = connect(mapStateToProps)(({ tool }) => {
    if (toolControls.has(tool)) {
        const ToolControl = toolControls.get(tool);
        return <ToolControl />;
    }
    return null;
});
