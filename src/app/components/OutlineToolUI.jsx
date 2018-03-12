/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { noop } from "../util/funcTools";
import { executeOnPlainMouseDown } from "../util/eventTools";

import { SELECT_MODE, EDIT_MODE } from "../actions/actionTypes";

import {
    createPatchAction,
    setSelectionAction,
    addOutlineNodeAction
} from "../actions/actionGenerators";

import { OutlineToolPatch } from "./OutlineToolPatch";

const mapStateToProps = ({ currentTool: { mode }, selection, patches }) => ({
    mode,
    selection,
    patches
});
export const OutlineToolUI = connect(mapStateToProps)((props) => {
    const {
        dispatch, mode, selection, patches
    } = props;

    const createPatch = (newPatchId) => dispatch(createPatchAction(newPatchId));
    const setSelection = (id) => dispatch(setSelectionAction(id));
    const addNode = (patchId, point) => {
        const randNum = Math.floor(Math.random() * 1e16);
        const nodeId = `bad-ID-${randNum.toString(16)}`;

        dispatch(addOutlineNodeAction(patchId, nodeId, point));
    };

    let workspaceEventHandler;
    const workspaceElement = document.querySelector(".workspace");
    switch (mode) {
        case SELECT_MODE: {
            workspaceEventHandler = () => setSelection(null);
            break;
        }
        case EDIT_MODE: {
            workspaceEventHandler = (e) => {
                const point = d3.clientPoint(workspaceElement, e);

                // Add to selected patch. If none are selected, create one.
                if (selection) {
                    const patchId = selection;
                    addNode(patchId, point);
                } else {
                    const randNum = Math.floor(Math.random() * 1e16);
                    const newPatchId = `bad-ID-${randNum.toString(16)}`;
                    createPatch(newPatchId);
                    setSelection(newPatchId);
                    addNode(newPatchId, point);
                }
            };
            break;
        }
        default: {
            workspaceEventHandler = noop;
        }
    }

    // Install listener on `svg.workspace` element (which contains everything)
    d3
        .select(workspaceElement)
        .on("mousedown.workspace.outlineTool", () =>
            executeOnPlainMouseDown(workspaceEventHandler)(d3.event));

    // Render patches with appropriate listener
    return (
        <g className="outlineToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline }] = patchEntry;
                const selected = patchId === selection;

                // Choose event listeners for depending on mode.
                let patchEventHandler;
                switch (mode) {
                    case SELECT_MODE: {
                        patchEventHandler = (e) => {
                            e.stopPropagation();
                            setSelection(patchId);
                        };
                        break;
                    }
                    case EDIT_MODE: {
                        patchEventHandler = noop;
                        break;
                    }
                    default: {
                        patchEventHandler = noop;
                    }
                }

                return (
                    <OutlineToolPatch
                        key={patchId}
                        patchId={patchId}
                        outline={outline}
                        selected={selected}
                        patchEventHandler={patchEventHandler}
                    />
                );
            })}
        </g>
    );
});
