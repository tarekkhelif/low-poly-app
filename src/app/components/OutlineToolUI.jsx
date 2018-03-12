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

    const setSelection = (id) => dispatch(setSelectionAction(id));

    const addNode = (patchId, point) => {
        const randNum = Math.floor(Math.random() * 1e16);
        const nodeId = `bad-ID-${randNum.toString(16)}`;

        dispatch(addOutlineNodeAction(patchId, nodeId, point));
    };

    return (
        <g className="outlineToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline }] = patchEntry;
                const selected = patchId === selection;

                // Choose event listeners for `.workspace` and `.patch`
                //   depending on mode.
                let workspaceEventHandler;
                let patchEventHandler;
                switch (mode) {
                    case SELECT_MODE: {
                        workspaceEventHandler = () => setSelection(null);
                        patchEventHandler = () => setSelection(patchId);
                        break;
                    }
                    case EDIT_MODE: {
                        const patchElement = d3.select(`#${patchId}`).node();
                        workspaceEventHandler = (e) =>
                            addNode(patchId, d3.clientPoint(patchElement, e));
                        patchEventHandler = (e) =>
                            addNode(patchId, d3.clientPoint(patchElement, e));
                        break;
                    }
                    default: {
                        workspaceEventHandler = noop;
                        patchEventHandler = noop;
                    }
                }

                return (
                    <OutlineToolPatch
                        key={patchId}
                        patchId={patchId}
                        outline={outline}
                        selected={selected}
                        workspaceEventHandler={workspaceEventHandler}
                        patchEventHandler={(e) => {
                            e.stopPropagation();
                            patchEventHandler(e);
                        }}
                    />
                );
            })}
        </g>
    );
});
