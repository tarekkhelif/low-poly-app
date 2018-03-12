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

/* const {
    dispatch, mode, selection, patches
} = this.props; */
const mapStateToProps = ({ currentTool: { mode }, selection, patches }) => ({
    mode,
    selection,
    patches
});
export const OutlineToolUI = connect(mapStateToProps)(class extends React.Component {
    constructor(props) {
        super(props);

        this.listenedForEvents = [];

        this.createPatch = this.createPatch.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.addNode = this.addNode.bind(this);
    }

    componentDidMount() {
        this.setUp();
    }

    componentWillUpdate() {
        this.tearDown();
    }

    componentDidUpdate() {
        this.setUp();
    }

    componentWillUnmount() {
        this.tearDown();
    }

    setUp() {
        this.createListeners();
        this.installListeners();
    }

    // eslint-disable-next-line react/sort-comp
    tearDown() {
        this.uninstallListeners();
    }

    createListeners() {
        const { selection } = this.props;
        const { createPatch, setSelection, addNode } = this;
        const workspaceElement = document.querySelector(".workspace");

        this.handlers = new Map([
            [
                SELECT_MODE,
                [
                    {
                        element: workspaceElement,
                        eventType: "mousedown.select.workspace.outlineTool",
                        handler: () => setSelection(null),
                        modifiersWrapper: executeOnPlainMouseDown
                    }
                ]
            ],
            [
                EDIT_MODE,
                [
                    {
                        element: workspaceElement,
                        eventType: "mousedown.edit.workspace.outlineTool",
                        handler: (e) => {
                            const point = d3.clientPoint(
                                workspaceElement,
                                e
                            );

                                // Add to selected patch. If none are selected,
                                //   create one.
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
    }

    installListeners() {
        const { mode } = this.props;

        // Install listeners, then add to thie list of installed listeners
        const toInstall = this.handlers.has(mode)
            ? this.handlers.get(mode)
            : [];
        toInstall.forEach(({
            element, eventType, handler, modifiersWrapper
        }) => {
            this.listenedForEvents.push({ element, eventType });
            d3
                .select(element)
                .on(eventType, () =>
                    modifiersWrapper(handler)(d3.event));
        });
    }

    uninstallListeners() {
        if (this.listenedForEvents.length > 0) {
            const { element, eventType } = this.listenedForEvents.shift();
            d3.select(element).on(eventType, null);

            this.uninstallListeners();
        }
    }

    createPatch(newPatchId) {
        const { dispatch } = this.props;
        dispatch(createPatchAction(newPatchId));
    }

    setSelection(id) {
        const { dispatch } = this.props;
        dispatch(setSelectionAction(id));
    }

    addNode(patchId, point) {
        const { dispatch } = this.props;
        const randNum = Math.floor(Math.random() * 1e16);
        const nodeId = `bad-ID-${randNum.toString(16)}`;

        dispatch(addOutlineNodeAction(patchId, nodeId, point));
    }

    render() {
        const { mode, selection, patches } = this.props;

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
                                this.setSelection(patchId);
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
    }
});
