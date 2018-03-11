/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_TOOL } from "../actions/actionTypes";
import { OutlineToolUI } from "./OutlineToolUI";
import { DefaultToolUI } from "./DefaultToolUI";

const toolUIs = new Map([[OUTLINE_TOOL, OutlineToolUI]]);

const mapStateToProps = ({ currentTool: { tool } }) => ({ tool });
export const CurrentToolUI = connect(mapStateToProps)(({ tool }) => {
    if (toolUIs.has(tool)) {
        const ToolUI = toolUIs.get(tool);
        return <ToolUI />;
    }
    return <DefaultToolUI />;
});
