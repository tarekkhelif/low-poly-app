/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { noop } from "../util/funcTools";

import { SELECT_MODE, EDIT_MODE } from "../actions/actionTypes";

import {
    setSelectionAction,
    addOutlineNodeAction
} from "../actions/actionGenerators";

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

                const setSelection = (id) => dispatch(setSelectionAction(id));

                const addNode = (point) => {
                    const randNum = Math.floor(Math.random() * 1e16);
                    const nodeId = `bad-ID-${randNum.toString(16)}`;
                    dispatch(addOutlineNodeAction(patchId, nodeId, point));
                };

                const dispatchActionOnUnmodifiedMouseDown = (dispatchAction) => (e, ...args) => {
                    // e.stopPropagation();

                    const correctModifiers =
                        !e.ctrlKey && !e.altKey && !e.shiftKey && !e.button;

                    if (correctModifiers) {
                        dispatchAction(...args);
                    }
                };

                const setSelectionMouseDown = dispatchActionOnUnmodifiedMouseDown(setSelection);
                const addNodeMouseDown = dispatchActionOnUnmodifiedMouseDown(addNode);

                const patchElement = d3.select(`#${patchId}`).node();
                let onWorkspaceMouseDown;
                let onPatchMouseDown;
                switch (mode) {
                    case SELECT_MODE: {
                        onWorkspaceMouseDown = (e) =>
                            setSelectionMouseDown(e, null);
                        onPatchMouseDown = (e) =>
                            setSelectionMouseDown(e, patchId);
                        break;
                    }
                    case EDIT_MODE: {
                        onWorkspaceMouseDown = (e) =>
                            addNodeMouseDown(
                                e,
                                d3.clientPoint(patchElement, e)
                            );
                        onPatchMouseDown = (e) =>
                            addNodeMouseDown(
                                e,
                                d3.clientPoint(patchElement, e)
                            );
                        break;
                    }
                    default: {
                        onWorkspaceMouseDown = noop;
                        onPatchMouseDown = noop;
                    }
                }

                // Set listener on `.workspace` (the `<svg>` element eveything's
                //     inside of)
                d3
                    .select(".workspace")
                    .on("mousedown", () => onWorkspaceMouseDown(d3.event));

                return (
                    <g
                        key={patchId}
                        id={patchId}
                        className="patch"
                        onMouseDown={onPatchMouseDown}
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
