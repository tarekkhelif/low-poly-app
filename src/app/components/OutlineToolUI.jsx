/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { noop } from "../util/funcTools";
import { executeOnPlainMouseDown } from "../util/eventTools";

import { OUTLINE_SELECT_MODE, OUTLINE_EDIT_MODE } from "../actions/actionTypes";

import {
    setSelectionAction,
    outlineCreatePatchAction,
    outlineAddNodeAction
} from "../actions/actionGenerators";

import { HandlerInstaller } from "./HandlerInstaller";
import { Outline } from "./Outline";
import { OutlineNodes } from "./OutlineNodes";

type Props = {
    dispatch: (action: Object) => Object,
    mode: string,
    selection: string,
    patches: Object
};
const mapStateToProps = ({ currentTool: { mode }, selection, patches }) => ({
    mode,
    selection,
    patches
});
// eslint-disable-next-line max-len
export const OutlineToolUI = connect(mapStateToProps)(class extends React.Component<Props> {
    constructor(props) {
        super(props);

        // I think this is necessary for dispatch to work???
        this.createPatch = this.createPatch.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.addNode = this.addNode.bind(this);
    }

    // eslint-disable-next-line react/sort-comp
    createListeners() {
        const { selection } = this.props;
        const { createPatch, setSelection, addNode } = this;

        // Create all the listeners for each mode, which may depend on props
        const workspaceElement = document.querySelector(".workspace");
        const handlers = new Map([
            [
                OUTLINE_SELECT_MODE,
                [
                    {
                        // Clear the selection
                        element: workspaceElement,
                        eventType: "mousedown.select.workspace.outlineTool",
                        handler: () => setSelection(null),
                        modifiersWrapper: executeOnPlainMouseDown
                    }
                ]
            ],
            [
                OUTLINE_EDIT_MODE,
                [
                    {
                        // Add to selected patch. If none are selected, create
                        //   a new one.
                        element: workspaceElement,
                        eventType: "mousedown.edit.workspace.outlineTool",
                        handler: (e) => {
                            const point = d3.clientPoint(
                                workspaceElement,
                                e
                            );

                            if (selection) {
                                const patchId = selection;
                                addNode(patchId, point);
                            } else {
                                /* eslint-disable max-len */
                                const randNum = Math.floor(Math.random() * 1e16);
                                const newPatchId = `bad-ID-${randNum.toString(16)}`;
                                /* eslint-enable max-len */
                                createPatch(newPatchId);
                                setSelection(newPatchId);
                                addNode(newPatchId, point);
                            }
                        },
                        modifiersWrapper: executeOnPlainMouseDown
                    }
                ]
            ]
        ]);

        return handlers;
    }

    // ACTION DISPATCHERS
    // #region
    createPatch(newPatchId) {
        const { dispatch } = this.props;
        dispatch(outlineCreatePatchAction(newPatchId));
    }

    setSelection(id) {
        const { dispatch } = this.props;
        dispatch(setSelectionAction(id));
    }

    addNode(patchId, point) {
        const { dispatch } = this.props;
        const randNum = Math.floor(Math.random() * 1e16);
        const nodeId = `bad-ID-${randNum.toString(16)}`;

        dispatch(outlineAddNodeAction(patchId, nodeId, point));
    }
    // #endregion

    render() {
        const { mode, selection, patches } = this.props;

        // Recreate listeners in case changes in properties change what they do
        const handlers = this.createListeners();
        // Get the handlers for the current mode
        const modeHandlers = handlers.has(mode) ? handlers.get(mode) : [];

        // Move the selected patch so it is rendered on top of the others
        const patchesArray = Object.entries(patches);
        const indexOfSelected = Object.keys(patches).indexOf(selection);
        if (indexOfSelected >= 0) {
            patchesArray.push(...patchesArray.splice(indexOfSelected, 1));
        }

        // Render patches and install event handlers
        return (
            <g className="outlineToolUI">
                {/* `HandlerInstaller` installs/updates/uninstalls listeners at
                        the appropriate lifecycle stages */}
                <HandlerInstaller handlers={modeHandlers} />
                {/* Render each patch */}
                {patchesArray.map((patchEntry) => {
                    const [patchId, { outline }] = patchEntry;
                    const selected = patchId === selection;

                    // Choose event listeners for depending on mode.
                    let patchEventHandler;
                    switch (mode) {
                        case OUTLINE_SELECT_MODE: {
                            patchEventHandler = (e) => {
                                e.stopPropagation();
                                this.setSelection(patchId);
                            };
                            break;
                        }
                        case OUTLINE_EDIT_MODE: {
                            patchEventHandler = noop;
                            break;
                        }
                        default: {
                            patchEventHandler = noop;
                        }
                    }

                    return (
                        <g
                            key={patchId}
                            id={patchId}
                            className="patch"
                            onMouseDown={executeOnPlainMouseDown(patchEventHandler)}
                        >
                            <Outline
                                id={`${patchId}-outline`}
                                selected={selected}
                                closed={
                                    !(
                                        mode === OUTLINE_EDIT_MODE &&
                                            selected
                                    )
                                }
                                outline={outline}
                            />
                            <OutlineNodes
                                patchId={patchId}
                                visibility={
                                    mode === OUTLINE_EDIT_MODE && selected
                                        ? "inherit"
                                        : "hidden"
                                }
                            />
                        </g>
                    );
                })}
            </g>
        );
    }
});
