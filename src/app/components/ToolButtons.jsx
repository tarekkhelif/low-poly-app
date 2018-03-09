/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { changeToolAction } from "../actions/actionGenerators";
import {
    TOOL_IMPORT_RASTER,
    TOOL_EDIT_AN_OUTLINE,
    TOOL_EDIT_TESSELATIONS,
    TOOL_SAVE_ART
} from "../actions/actionTypes";

const tools = [
    { name: TOOL_IMPORT_RASTER, uiLabel: "Import Image" },
    { name: TOOL_EDIT_AN_OUTLINE, uiLabel: "Outline" },
    { name: TOOL_EDIT_TESSELATIONS, uiLabel: "Edit Tesselation" },
    { name: TOOL_SAVE_ART, uiLabel: "Save Art" },
];

export const ToolButtons = connect()(({ dispatch }) => (
    <div className="toolButtons">
        {tools.map(({ name, uiLabel }) => (
            <button
                key={name}
                id={name}
                className="toolButton"
                onClick={() => dispatch(changeToolAction(name))}
            >
                {uiLabel}
            </button>))
        }
    </div>
));
