/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { SELECT_MODE, EDIT_MODE } from "../actions/actionTypes";

import { setSelectionAction } from "../actions/actionGenerators";

import { Outline } from "./Outline";
import { OutlineNodes } from "./OutlineNodes";

const mapStateToProps = ({ currentTool: { mode }, selection, patches }) => ({
    mode,
    selection,
    patches
});
export const OutlineToolUI = connect(mapStateToProps)((props) => {
    const {
        dispatch, mode, selection, patches
    } = props;

    return (
        <g className="outlineToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline }] = patchEntry;

                const selected = patchId === selection;

                const selectPatch = (e) => {
                    e.stopPropagation();

                    const correctModifiers =
                        !e.ctrlKey && !e.altKey && !e.shiftKey && !e.button;
                    if (correctModifiers) {
                        dispatch(setSelectionAction(patchId));
                    }
                };

                let onMouseDown;
                switch (mode) {
                    case SELECT_MODE: {
                        onMouseDown = selectPatch;
                        break;
                    }
                    case EDIT_MODE: {
                        onMouseDown = null;
                        break;
                    }
                    default: {
                        onMouseDown = null;
                    }
                }

                return (
                    <g
                        key={patchId}
                        id={patchId}
                        className="patch"
                        onMouseDown={onMouseDown}
                    >
                        <Outline
                            id={`${patchId}-outline`}
                            selected={selected}
                            outline={outline}
                        />
                        <OutlineNodes patchId={patchId} selected={selected} />
                    </g>
                );
            })}
        </g>
    );
});
