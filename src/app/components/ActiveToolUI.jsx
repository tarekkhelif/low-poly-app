/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_TOOL } from "../actions/actionTypes";
import { DefaultToolUI } from "./DefaultToolUI";
import { OutlineToolUI } from "./OutlineToolUI";

const toolUIs = new Map([
    [OUTLINE_TOOL, OutlineToolUI]
]);

const ActiveToolUI = ({ tool }) => {
    if (toolUIs.has(tool)) {
        const ToolUI = toolUIs.get(tool);
        return <ToolUI />;
    }
    return <DefaultToolUI />;
};

const mapStateToProps = (state) => {
    const { tool } = state.currentTool;

    return { tool };
};

export const ConnectedActiveToolUI = connect(mapStateToProps)(ActiveToolUI);
