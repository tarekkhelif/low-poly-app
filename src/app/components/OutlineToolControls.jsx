/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { SELECT_MODE, EDIT_MODE } from "../actions/actionTypes";

import { changeOutlineModeAction } from "../actions/actionGenerators";

const mapStateToProps = ({ currentTool: { mode } }) => ({ mode });
export const OutlineToolControls = connect(mapStateToProps)((props) => {
    const { dispatch, mode } = props;

    const selectMode = () => dispatch(changeOutlineModeAction(SELECT_MODE));
    const editMode = () => dispatch(changeOutlineModeAction(EDIT_MODE));

    return (
        <div className="outlineToolControls">
            <button
                className={mode === SELECT_MODE ? "active" : ""}
                onClick={selectMode}
            >
                Select
            </button>
            <button
                className={mode === EDIT_MODE ? "active" : ""}
                onClick={editMode}
            >
                Edit
            </button>
        </div>
    );
});
