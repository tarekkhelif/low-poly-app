/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { OUTLINE_SELECT_MODE, OUTLINE_EDIT_MODE } from "../actions/actionTypes";

import { outlineChangeModeAction } from "../actions/actionGenerators";

const mapStateToProps = ({ currentTool: { mode } }) => ({ mode });
export const OutlineToolControls = connect(mapStateToProps)((props) => {
    const { dispatch, mode } = props;

    const selectMode = () =>
        dispatch(outlineChangeModeAction(OUTLINE_SELECT_MODE));
    const editMode = () => dispatch(outlineChangeModeAction(OUTLINE_EDIT_MODE));

    return (
        <div className="outlineToolControls">
            <button
                className={mode === OUTLINE_SELECT_MODE ? "active" : ""}
                onClick={selectMode}
            >
                Select
            </button>
            <button
                className={mode === OUTLINE_EDIT_MODE ? "active" : ""}
                onClick={editMode}
            >
                Edit
            </button>
        </div>
    );
});
