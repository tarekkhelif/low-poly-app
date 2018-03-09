/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

const toolUIs = {};

const ActiveToolUI = ({ tool }) => {
    if (Object.prototype.hasOwnProperty.call(toolUIs, tool)) {
        return toolUIs[tool];
    }
    return <g className="defaultForUnrecognizedTools" />;
};

const mapStateToProps = (state) => {
    const { tool } = state.currentTool;

    return { tool };
};

export const ConnectedActiveToolUI = connect(mapStateToProps)(ActiveToolUI);
