/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_TOOL, TESSELATION_TOOL } from "../actions/actionTypes";
import { OutlineToolControls } from "./OutlineToolControls";
import { TesselationToolControls } from "./TesselationToolControls";

const toolControls = new Map([
    [OUTLINE_TOOL, OutlineToolControls],
    [TESSELATION_TOOL, TesselationToolControls]
]);

const mapStateToProps = ({ currentTool: { tool } }) => ({ tool });
export const CurrentToolControls = connect(mapStateToProps)(({ tool }) => {
    if (toolControls.has(tool)) {
        const ToolControl = toolControls.get(tool);
        return (
            <React.Fragment>
                <hr
                    style={{
                        marginTop: "14px",
                        marginBottom: "14px"
                    }}
                />
                <ToolControl />
            </React.Fragment>
        );
    }
    return null;
});
