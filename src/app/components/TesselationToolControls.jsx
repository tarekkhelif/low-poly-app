/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import {
    TESSELATION_SELECT_MODE,
    TESSELATION_CREATE_MODE,
    TESSELATION_EDIT_MODE
} from "../actions/actionTypes";

import { tesselationChangeModeAction } from "../actions/actionGenerators";

import { TesselationCreateControls } from "./TesselationCreateControls";

const mapStateToProps = ({ currentTool: { mode } }) => ({ mode });
export const TesselationToolControls = connect(mapStateToProps)((props) => {
    const { dispatch, mode } = props;

    const selectMode = () =>
        dispatch(tesselationChangeModeAction(TESSELATION_SELECT_MODE));
    const createMode = () =>
        dispatch(tesselationChangeModeAction(TESSELATION_CREATE_MODE));
    const editMode = () =>
        dispatch(tesselationChangeModeAction(TESSELATION_EDIT_MODE));

    return (
        <div className="outlineToolControls">
            <button
                className={mode === TESSELATION_SELECT_MODE ? "active" : ""}
                onClick={selectMode}
            >
                Select
            </button>
            <div className={TESSELATION_CREATE_MODE}>
                <hr />
                <button
                    className={mode === TESSELATION_CREATE_MODE ? "active" : ""}
                    onClick={createMode}
                >
                    Create
                </button>
                {mode === TESSELATION_CREATE_MODE ? (
                    <TesselationCreateControls />
                ) : null}
                <hr />
            </div>
            <button
                className={mode === TESSELATION_EDIT_MODE ? "active" : ""}
                onClick={editMode}
            >
                Edit
            </button>
        </div>
    );
});
